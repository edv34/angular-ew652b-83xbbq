import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouterModule,
  Routes,
  UrlSegment
} from '@angular/router';


export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  private handlers: { [key: string]: DetachedRouteHandle } = {};

  /**
   * Determines if this route (and its subtree) should be detached to be reused later
   * @param route
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {

    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return false;
    }
    /** Whether this route should be re used or not */
    let shouldReuse = false;
    if ( route.routeConfig.data ) {
      route.routeConfig.data.reuse ? shouldReuse = true : shouldReuse = false;
    }
    
    return shouldReuse;
  }

  /**
   * Stores the detached route.
   */
  store( route: ActivatedRouteSnapshot, handler: DetachedRouteHandle ): void {
    if ( handler ) {
      this.handlers[this.getUrl(route)] = handler;
    }
  }

  /**
   * Determines if this route (and its subtree) should be reattached
   * @param route Stores the detached route.
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.handlers[this.getUrl(route)];
  }

  /**
   * Retrieves the previously stored route
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return null;
    };

    return this.handlers[this.getUrl(route)];
  }

  /**
   * Determines if a route should be reused
   * @param future
   * @param current
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    let reUseUrl = false;
    /*
    if ( future.routeConfig ) {
      if (future.routeConfig.data ) {
        reUseUrl = future.routeConfig.data.reuse;
      }
    }
    */
    const defaultReuse = (future.routeConfig === current.routeConfig);

    // If either of our reuseUrl and default Url are true, we want to reuse the route
    //
    return reUseUrl || defaultReuse;
  }

  /**
   * Returns a url for the current route
   * @param route
   */
  getUrl(route: ActivatedRouteSnapshot): string {
    /** The url we are going to return */
    if ( route.routeConfig ) {
      const url = route.routeConfig.path;

      return url;
    }
  }
}
