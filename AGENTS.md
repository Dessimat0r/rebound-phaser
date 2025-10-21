# Contributor guidance

## Repository scope
This document applies to the entire `rebound-phaser` repository. If you add nested directories with specialised requirements, create additional `AGENTS.md` files in those folders.

## Coding guidelines
- Use modern ES2020+ JavaScript or TypeScript. Prefer ES modules over legacy script tags.
- Phaser scenes should be organised under `src/scenes/` and kept focused on a single responsibility.
- Keep assets in `assets/` if you add any. Optimise images for the web before committing them.
- Avoid adding build tooling unless it clearly improves developer experience; the default setup is intentionally lightweight.

## Documentation
- Update `README.md` whenever you add a significant feature or change the development workflow.
- When introducing new controls or gameplay mechanics, document them both in code comments (where helpful) and in the README.

## Testing & validation
- Manually verify the game in at least one evergreen desktop browser before opening a pull request.
- Include instructions for reproducing any test scenario that requires special steps.

## Git hygiene
- Do not commit `node_modules/` or other generated artefacts. Use `.gitignore` to keep the repository clean.
- Keep commits focused and write descriptive commit messages that explain the intent of the change.
