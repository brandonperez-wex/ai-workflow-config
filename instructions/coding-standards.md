# Coding Standards

## TypeScript

- Use strict mode (`"strict": true`)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for public functions
- Avoid `any` - use `unknown` and narrow types
- Use const assertions for literal types

```typescript
// Good
interface User {
  id: string;
  name: string;
}

// Avoid
type User = {
  id: string;
  name: string;
}
```

## React

- Use functional components with hooks
- Keep components small and focused
- Co-locate related files (component, styles, tests)
- Use custom hooks to extract reusable logic
- Prefer controlled components

```typescript
// Component structure
export function MyComponent({ prop }: Props) {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Derived state
  const computed = useMemo(() => ..., [deps]);

  // 3. Effects
  useEffect(() => { ... }, [deps]);

  // 4. Event handlers
  const handleClick = () => { ... };

  // 5. Render
  return <div>...</div>;
}
```

## CSS / Tailwind

- Use Tailwind utility classes
- Extract repeated patterns to components, not CSS
- Use CSS variables for theming (Tailwind v4 `@theme`)
- Prefer `gap` over margins for spacing
- Use logical properties (`ms-4` not `ml-4`) for RTL support

## File Organization

```
src/
├── components/
│   ├── ui/           # Base UI components (shadcn)
│   └── features/     # Feature-specific components
├── lib/
│   ├── utils.ts      # Utility functions
│   └── hooks/        # Custom hooks
├── types/            # TypeScript types
└── app/ or pages/    # Routes/pages
```

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase | `interface UserProfile` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| CSS classes | kebab-case | `.user-profile` |

## Error Handling

- Use try/catch for async operations
- Provide meaningful error messages
- Log errors with context
- Fail fast, recover gracefully
- Use Result types for expected failures

```typescript
// Good
try {
  const result = await fetchUser(id);
  return { success: true, data: result };
} catch (error) {
  console.error(`Failed to fetch user ${id}:`, error);
  return { success: false, error: 'User not found' };
}
```
