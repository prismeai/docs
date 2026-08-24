#!/usr/bin/env python3
"""Audit a Mintlify MDX page for structural and documentation-quality issues."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


@dataclass(frozen=True)
class Issue:
    severity: str
    code: str
    message: str
    line: int | None = None


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def strip_fenced_code(text: str) -> str:
    # Blank fenced blocks line by line so offsets keep mapping to real line numbers.
    # Fences must open at the start of a line, so inline ```spans``` never toggle state.
    out: list[str] = []
    fence: str | None = None
    for line in text.split("\n"):
        stripped = line.lstrip()
        if fence is None and (stripped.startswith("```") or stripped.startswith("~~~")):
            fence = stripped[:3]
            out.append("")
        elif fence is not None:
            if stripped.startswith(fence):
                fence = None
            out.append("")
        else:
            out.append(line)
    return "\n".join(out)


def frontmatter(text: str) -> tuple[dict[str, str], int]:
    match = re.match(r"\A---\s*\n(.*?)\n---\s*(?:\n|\Z)", text, re.DOTALL)
    if not match:
        return {}, 0
    data: dict[str, str] = {}
    for raw_line in match.group(1).splitlines():
        if ":" not in raw_line or raw_line.lstrip().startswith("#"):
            continue
        key, value = raw_line.split(":", 1)
        data[key.strip()] = value.strip().strip("'\"")
    return data, match.end()


def all_json_strings(value: object) -> set[str]:
    strings: set[str] = set()
    if isinstance(value, str):
        # Only path-like strings count as navigable routes; titles, group names,
        # and colors in docs.json must not make broken links pass.
        if "/" in value and not value.startswith("#"):
            strings.add(value.strip("/"))
    elif isinstance(value, list):
        for item in value:
            strings.update(all_json_strings(item))
    elif isinstance(value, dict):
        for item in value.values():
            strings.update(all_json_strings(item))
    return strings


def load_nav_pages(root: Path) -> set[str]:
    nav_path = root / "docs.json"
    if not nav_path.exists():
        return set()
    try:
        return all_json_strings(json.loads(nav_path.read_text(encoding="utf-8")))
    except (OSError, json.JSONDecodeError):
        return set()


def internal_target_exists(target: str, page: Path, root: Path, nav: set[str]) -> bool:
    clean = target.split("#", 1)[0].split("?", 1)[0]
    if not clean:
        return True
    if clean.startswith("/"):
        route = clean.strip("/")
        candidates = [root / f"{route}.mdx", root / route / "index.mdx"]
        if "." in Path(route).name:
            candidates.append(root / route)  # asset reference with a file extension
        return route in nav or any(candidate.is_file() for candidate in candidates)
    resolved = (page.parent / clean).resolve()
    candidates = [resolved, Path(f"{resolved}.mdx"), resolved / "index.mdx"]
    return any(candidate.exists() for candidate in candidates)


def collect_links(text: str) -> list[tuple[str, int]]:
    links: list[tuple[str, int]] = []
    patterns = [
        re.compile(r"\bhref\s*=\s*[\"']([^\"']+)[\"']"),
        re.compile(r"!?\[[^\]]*\]\(([^)\s]+)(?:\s+[\"'][^\"']*[\"'])?\)"),
        re.compile(r"\bsrc\s*=\s*[\"']([^\"']+)[\"']"),
    ]
    for pattern in patterns:
        for match in pattern.finditer(text):
            links.append((match.group(1), line_number(text, match.start())))
    return links


def audit(page: Path, root: Path, profile: str) -> list[Issue]:
    issues: list[Issue] = []
    text = page.read_text(encoding="utf-8")
    prose = strip_fenced_code(text)
    metadata, body_start = frontmatter(text)

    if not metadata:
        issues.append(Issue("ERROR", "frontmatter.missing", "Add YAML frontmatter at the start of the page.", 1))
    for field in ("title", "description"):
        value = metadata.get(field, "").strip()
        if not value:
            issues.append(Issue("ERROR", f"frontmatter.{field}", f"Add a non-empty {field} field.", 1))
        elif re.search(r"<<|\b(?:TODO|TBD|FIXME)\b", value):
            issues.append(Issue("ERROR", f"frontmatter.{field}_placeholder", f"Replace the placeholder in {field}.", 1))

    if metadata.get("description") and not 50 <= len(metadata["description"]) <= 300:
        issues.append(Issue("WARNING", "frontmatter.description_length", "Keep the description between 50 and 300 characters.", 1))

    body = prose[body_start:] if body_start else prose
    headings: list[tuple[int, str, int]] = []
    for match in re.finditer(r"(?m)^(#{1,6})\s+(.+?)\s*$", body):
        headings.append((len(match.group(1)), match.group(2).strip(), line_number(prose, body_start + match.start())))

    previous = 1
    seen: dict[str, int] = {}
    for level, heading, line in headings:
        if level > previous + 1:
            issues.append(Issue("ERROR", "heading.skipped_level", f"Heading '{heading}' skips from level {previous} to {level}.", line))
        previous = level
        normalized = re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")
        if normalized in seen:
            issues.append(Issue("WARNING", "heading.duplicate", f"Heading '{heading}' duplicates an anchor first used on line {seen[normalized]}.", line))
        else:
            seen[normalized] = line

    for match in re.finditer(r"<img\b.*?>", prose, re.DOTALL | re.IGNORECASE):
        tag = match.group(0)
        if not re.search(r"\balt\s*=", tag, re.IGNORECASE):
            issues.append(Issue("ERROR", "image.alt_missing", "Add an alt attribute to the image.", line_number(prose, match.start())))

    for match in re.finditer(r"!\[([^\]]*)\]\([^)]+\)", prose):
        if not match.group(1).strip():
            issues.append(Issue("WARNING", "image.alt_empty", "Confirm that the image is decorative; otherwise add purpose-based alt text.", line_number(prose, match.start())))

    nav = load_nav_pages(root)
    seen_targets: set[tuple[str, int]] = set()
    for target, line in collect_links(prose):
        key = (target, line)
        if key in seen_targets:
            continue
        seen_targets.add(key)
        if target.startswith(("mailto:", "tel:", "data:")) or target.startswith("#"):
            continue
        parsed = urlparse(target)
        if parsed.scheme in {"http", "https"}:
            if not parsed.netloc:
                issues.append(Issue("ERROR", "link.external_malformed", f"Malformed external URL: {target}", line))
            continue
        if parsed.scheme:
            continue
        if not internal_target_exists(target, page, root, nav):
            issues.append(Issue("ERROR", "link.internal_broken", f"Internal target does not resolve: {target}", line))

    placeholder_patterns = [
        (r"<<[^>]+>>", "placeholder.angle", "Replace template placeholders.", 0),
        (r"\b(?:TODO|TBD|FIXME)\b", "placeholder.todo", "Resolve unfinished content markers.", 0),
        (r"(?:<!--|\{/\*)\s*REVIEW:", "review.marker", "Resolve or report the human review marker.", re.IGNORECASE),
    ]
    for pattern, code, message, flags in placeholder_patterns:
        for match in re.finditer(pattern, prose, flags):
            severity = "WARNING" if code == "review.marker" else "ERROR"
            issues.append(Issue(severity, code, message, line_number(prose, match.start())))

    temporal = re.search(r"\b(?:currently|coming soon|at the time of writing)\b", body, re.IGNORECASE)
    if temporal:
        issues.append(Issue("WARNING", "style.temporal", "Check temporal wording; evergreen docs should describe supported current behavior directly.", line_number(prose, body_start + temporal.start())))
    vague = re.search(r"\[(?:click here|here|read more)\]", body, re.IGNORECASE)
    if vague:
        issues.append(Issue("WARNING", "link.vague_text", "Replace vague link text with a destination or outcome.", line_number(prose, body_start + vague.start())))

    if profile == "connector":
        checks = [
            (r"prerequisite|before you begin", "connector.prerequisites", "Add explicit provider and Prisme.ai prerequisites."),
            (r"choose your path|who (?:is this for|does what)|agent builder|workspace builder", "connector.roles", "Add a role/entry-point router or explicit actor sections."),
            (r"verify|test the flow|expected result", "connector.verification", "Add independent success verification."),
            (r"troubleshoot|error handling|common issues", "connector.troubleshooting", "Add symptom-oriented troubleshooting."),
            (r"runtime identity|acts as|per-user|shared credential|service account", "connector.identity", "State whose provider identity and permissions each auth mode uses."),
            (r"revoke|disconnect|remove|uninstall|rotate", "connector.lifecycle", "Document revoke, removal, or rotation lifecycle."),
        ]
        for pattern, code, message in checks:
            if not re.search(pattern, body, re.IGNORECASE):
                issues.append(Issue("WARNING", code, message))
        if re.search(r"mcp-api-key", body, re.IGNORECASE):
            issues.append(Issue("WARNING", "connector.deprecated_mcp_api_key", "Verify this legacy mechanism against the implementation; do not present it as the recommended path."))
        if re.search(r"oauth|api token|personal access token|client credentials", body, re.IGNORECASE) and not re.search(
            r"recommended|best for|choose|operating model|authentication methods?", body, re.IGNORECASE
        ):
            issues.append(Issue("WARNING", "connector.auth_decision", "Add a credential decision rule before setup."))

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("page", type=Path, help="MDX page to audit")
    parser.add_argument("--docs-root", type=Path, default=Path.cwd(), help="Documentation repository root")
    parser.add_argument("--profile", choices=("generic", "connector"), default="generic")
    parser.add_argument("--strict", action="store_true", help="Return non-zero for warnings as well as errors")
    args = parser.parse_args()

    page = args.page.resolve()
    root = args.docs_root.resolve()
    if not page.is_file():
        print(f"ERROR input.missing: Page does not exist: {page}")
        return 2
    if page.suffix.lower() != ".mdx":
        print(f"ERROR input.extension: Expected an .mdx page: {page}")
        return 2

    issues = audit(page, root, args.profile)
    for issue in sorted(issues, key=lambda item: (item.line or 10**9, item.severity, item.code)):
        location = f":{issue.line}" if issue.line else ""
        print(f"{issue.severity} {issue.code} {page}{location}: {issue.message}")

    errors = sum(issue.severity == "ERROR" for issue in issues)
    warnings = sum(issue.severity == "WARNING" for issue in issues)
    print(f"SUMMARY {page}: {errors} error(s), {warnings} warning(s)")
    return 1 if errors or (args.strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main())
