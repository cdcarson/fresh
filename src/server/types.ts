import { ComponentType } from 'preact';
import { ConnInfo, router, ServeInit } from './deps.ts';
import { InnerRenderFunction, RenderContext } from './render.tsx';

// --- APPLICATION CONFIGURATION ---

export type StartOptions = ServeInit & FreshOptions;

export interface FreshOptions {
  render?: RenderFunction;
}

export type RenderFunction = (
  ctx: RenderContext,
  render: InnerRenderFunction
) => void | Promise<void>;

/// --- ROUTES ---

// deno-lint-ignore no-explicit-any
export interface PageProps<T = any> {
  /** The URL of the request that resulted in this page being rendered. */
  url: URL;

  /** The route matcher (e.g. /blog/:id) that the request matched for this page
   * to be rendered. */
  route: string;

  /**
   * The parameters that were matched from the route.
   *
   * For the `/foo/:bar` route with url `/foo/123`, `params` would be
   * `{ bar: '123' }`. For a route with no matchers, `params` would be `{}`. For
   * a wildcard route, like `/foo/:path*` with url `/foo/bar/baz`, `params` would
   * be `{ path: 'bar/baz' }`.
   */
  params: Record<string, string>;

  /**
   * Additional data passed into `HandlerContext.render`. Defaults to
   * `undefined`.
   */
  data: T;
}

export interface RouteConfig {
  /**
   * A route override for the page. This is useful for pages where the route
   * can not be expressed through the filesystem routing capabilities.
   *
   * The route override must be a path-to-regexp compatible route matcher.
   */
  routeOverride?: string;

  /**
   * If Content-Security-Policy should be enabled for this page. If 'true', a
   * locked down policy will be used that allows only the scripts and styles
   * that are generated by fresh. Additional scripts and styles can be added
   * using the `useCSP` hook.
   */
  csp?: boolean;
}

export type HandlerContext<
  Data = unknown,
  State = Record<string, unknown>
> = ConnInfo & {
  params: Record<string, string>;
  render: (data?: Data) => Response | Promise<Response>;
  state: State;
};

// deno-lint-ignore no-explicit-any
export type Handler<T = any, State = Record<string, unknown>> = (
  req: Request,
  ctx: HandlerContext<T, State>
) => Response | Promise<Response>;

// deno-lint-ignore no-explicit-any
export type Handlers<T = any, State = Record<string, unknown>> = {
  [K in typeof router.METHODS[number]]?: Handler<T, State>;
};

export interface RouteModule {
  default?: ComponentType<PageProps>;
  // deno-lint-ignore no-explicit-any
  handler?: Handler<any, any> | Handlers<any, any>;
  config?: RouteConfig;
}

// deno-lint-ignore no-explicit-any
export interface Route<Data = any> {
  pattern: string;
  url: string;
  name: string;
  component?: ComponentType<PageProps<Data>>;
  handler: Handler<Data> | Handlers<Data>;
  csp: boolean;
}

// --- APP ---

export interface AppProps {
  Component: ComponentType<Record<never, never>>;
}

export interface AppModule {
  default: ComponentType<AppProps>;
}

// --- UNKNOWN PAGE ---

export interface UnknownPageProps {
  /** The URL of the request that resulted in this page being rendered. */
  url: URL;

  /** The route matcher (e.g. /blog/:id) that the request matched for this page
   * to be rendered. */
  route: string;
}

export interface UnknownHandlerContext<State = Record<string, unknown>>
  extends ConnInfo {
  render: () => Response | Promise<Response>;
  state: State;
}

export type UnknownHandler = (
  req: Request,
  ctx: UnknownHandlerContext
) => Response | Promise<Response>;

export interface UnknownPageModule {
  default?: ComponentType<UnknownPageProps>;
  handler?: UnknownHandler;
  config?: RouteConfig;
}

export interface UnknownPage {
  pattern: string;
  url: string;
  name: string;
  component?: ComponentType<UnknownPageProps>;
  handler: UnknownHandler;
  csp: boolean;
}

// --- ERROR PAGE ---

export interface ErrorPageProps {
  /** The URL of the request that resulted in this page being rendered. */
  url: URL;

  /** The route matcher (e.g. /blog/:id) that the request matched for this page
   * to be rendered. */
  pattern: string;

  /** The error that caused the error page to be loaded. */
  error: unknown;
}

export interface ErrorHandlerContext<State = Record<string, unknown>>
  extends ConnInfo {
  error: unknown;
  render: () => Response | Promise<Response>;
  state: State;
}
export type ErrorHandler = (
  req: Request,
  ctx: ErrorHandlerContext
) => Response | Promise<Response>;

export interface ErrorPageModule {
  default?: ComponentType<ErrorPageProps>;
  handler?: ErrorHandler;
  config?: RouteConfig;
}

export interface ErrorPage {
  pattern: string;
  url: string;
  name: string;
  component?: ComponentType<ErrorPageProps>;
  handler: ErrorHandler;
  csp: boolean;
}

// --- MIDDLEWARES ---

export interface MiddlewareHandlerContext<State = Record<string, unknown>>
  extends ConnInfo {
  next: () => Promise<Response>;
  state: State;
}

export interface MiddlewareRoute extends Middleware {
  /**
   * path-to-regexp style url path
   */
  pattern: string;
  /**
   * URLPattern of the route
   */
  compiledPattern: URLPattern;
}

// deno-lint-ignore no-explicit-any
export interface MiddlewareModule<State = any> {
  handler(
    req: Request,
    ctx: MiddlewareHandlerContext<State>
  ): Response | Promise<Response>;
}

export interface Middleware<State = Record<string, unknown>> {
  handler(
    req: Request,
    ctx: MiddlewareHandlerContext<State>
  ): Response | Promise<Response>;
}

// --- ISLANDS ---

export interface IslandModule {
  // deno-lint-ignore no-explicit-any
  default: ComponentType<any>;
}

export interface Island {
  id: string;
  name: string;
  url: string;
  component: ComponentType<unknown>;
}
