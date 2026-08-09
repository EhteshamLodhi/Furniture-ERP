import 'react';

/**
 * `<ViewTransition>` ships in the React build Next.js bundles (and is enabled
 * by `experimental.viewTransition`), but `@types/react` does not declare it
 * yet. Typed here against the documented API.
 */
declare module 'react' {
  type ViewTransitionClass = 'none' | 'auto' | (string & {});

  type ViewTransitionClassPerType =
    | ViewTransitionClass
    | ({ default?: ViewTransitionClass } & Record<string, ViewTransitionClass>);

  interface ViewTransitionProps {
    children?: ReactNode;
    name?: string;
    default?: ViewTransitionClassPerType;
    enter?: ViewTransitionClassPerType;
    exit?: ViewTransitionClassPerType;
    share?: ViewTransitionClassPerType;
    update?: ViewTransitionClassPerType;
    onEnter?: (element: Element, types: string[]) => void;
    onExit?: (element: Element, types: string[]) => void;
    onShare?: (element: Element, types: string[]) => void;
    onUpdate?: (element: Element, types: string[]) => void;
  }

  const ViewTransition: ExoticComponent<ViewTransitionProps>;
}
