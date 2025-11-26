import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    showNavbar?: boolean;
    transition?: string;
  }
}

