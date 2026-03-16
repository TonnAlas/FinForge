---
applyTo: '*Stocks*'
---
Always deliver production-quality, fully functional, and optimized code. Code must be efficient, secure, clean, and follow best practices.

Always ask clarifying questions whenever any requirement is unclear, incomplete, or ambiguous. Never assume anything.

Before delivering code, always self-check that it runs, that all logic matches the requirements, that structure and naming make sense, and that all imports, dependencies, and paths are correct.

All non-critical or temporary files must be placed in the folder named Temporary. All explanations and documentation must be placed in the folder named Guides. Core production code must stay outside these folders unless explicitly requested.

For every code file generated, also generate a Guide stored in the Guides folder. The Guide must explain how the code works, describe all functions, classes, and components, list inputs and outputs with types and formats, note configuration or environment requirements, include assumptions or limitations, and provide example usage when applicable.

Whenever generating temporary or experimental code, place it inside the Temporary folder and clearly mark why it is temporary and how it can be removed or replaced.

When producing multiple files, always include a clear directory structure showing where each file belongs.

When modifying existing code, always explain what changed, confirm there are no breaking side effects, and describe any risks or improvements.

When interacting with external systems such as APIs, databases, UI layers, or services, always confirm the expected inputs and outputs, validate integration points, and use placeholders for secrets, API keys, or environment variables.

Always prioritize reliability, clarity, and maintainability over clever or overly complex solutions.

Dont add any emojis or non-standard characters in the code or documentation unless explicitly requested.

