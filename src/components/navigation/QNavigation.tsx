import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';

// Simulated React Router hooks types
type NavigateFunction = (path: string) => void;
type Location = {
  pathname: string;
};

// Simulated React Router hooks (you'd import these from react-router-dom)
const useNavigate = (): NavigateFunction => {
  return (path: string) => {
    console.log(`React Router: Navigating to ${path}`);
    // window.history.pushState({}, '', path);
  };
};

const useLocation = (): Location => {
  return { pathname: '/current-path' };
};

// Navigation types
const NAV_TYPES = {
  ROUTE: 'route',
  TAB: 'tab',
  MODAL: 'modal',
  SIDEBAR: 'sidebar',
} as const;

type NavigationType = (typeof NAV_TYPES)[keyof typeof NAV_TYPES];

// Action types
const ACTION_TYPES = {
  ROUTE_CHANGE: 'ROUTE_CHANGE',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  SWITCH_TAB: 'SWITCH_TAB',
  SIDEBAR_NAVIGATE: 'SIDEBAR_NAVIGATE',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
} as const;

// Interfaces
interface NavigationEntry {
  id: string;
  type: NavigationType;
  timestamp: string;
  title: string;
  path?: string;
  tabId?: string;
  modalId?: string;
  data?: Record<string, unknown>;
  parentRoute?: string;
  route?: string;
}

interface NavigationState {
  history: NavigationEntry[];
  activeModals: NavigationEntry[];
  currentRoute: string;
  currentTab: string | null;
  sidebarState: string | null;
  historyLimit: number;
}

// Action interfaces
interface RouteChangeAction {
  type: typeof ACTION_TYPES.ROUTE_CHANGE;
  payload: {
    path: string;
    title: string;
  };
}

interface OpenModalAction {
  type: typeof ACTION_TYPES.OPEN_MODAL;
  payload: {
    modalId: string;
    title: string;
    data?: Record<string, unknown>;
    parentRoute: string;
  };
}

interface CloseModalAction {
  type: typeof ACTION_TYPES.CLOSE_MODAL;
  payload: {
    modalId: string;
  };
}

interface SwitchTabAction {
  type: typeof ACTION_TYPES.SWITCH_TAB;
  payload: {
    tabId: string;
    title: string;
    data?: Record<string, unknown>;
    route: string;
  };
}

interface SidebarNavigateAction {
  type: typeof ACTION_TYPES.SIDEBAR_NAVIGATE;
  payload: {
    path: string;
    title: string;
    data?: Record<string, unknown>;
    route: string;
  };
}

interface ClearHistoryAction {
  type: typeof ACTION_TYPES.CLEAR_HISTORY;
}

type NavigationAction =
  | RouteChangeAction
  | OpenModalAction
  | CloseModalAction
  | SwitchTabAction
  | SidebarNavigateAction
  | ClearHistoryAction;

// Navigation statistics interface
interface NavigationStats {
  totalNavigations: number;
  routeNavigations: number;
  tabSwitches: number;
  modalOpens: number;
  sidebarNavigations: number;
  activeModals: number;
  currentRoute: string;
  currentTab: string | null;
}

// Context value interface
interface NavigationContextValue {
  // State
  history: NavigationEntry[];
  activeModals: NavigationEntry[];
  currentRoute: string;
  currentTab: string | null;
  sidebarState: string | null;

  // Navigation functions
  navigateToRoute: (path: string) => void;
  openModal: (modalId: string, title: string, data?: Record<string, object>) => void;
  closeModal: (modalId: string) => void;
  switchTab: (tabId: string, title: string, data?: Record<string, object>) => void;
  sidebarNavigate: (path: string, title: string, data?: Record<string, object>) => void;
  clearHistory: () => void;

  // Analytics functions
  getNavigationStats: () => NavigationStats;
  getRecentHistory: (count?: number) => NavigationEntry[];

  // Constants
  NAV_TYPES: typeof NAV_TYPES;
}

// Provider props interface
interface NavigationProviderProps {
  children: ReactNode;
  historyLimit?: number;
}

// Navigation history reducer
const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  const createEntry = (type: NavigationType, data: Partial<NavigationEntry>): NavigationEntry => ({
    id: `${type}-${Date.now()}`,
    type,
    timestamp: new Date().toISOString(),
    title: '',
    ...data,
  });

  switch (action.type) {
    case ACTION_TYPES.ROUTE_CHANGE:
      return {
        ...state,
        history: [...state.history, createEntry(NAV_TYPES.ROUTE, action.payload)].slice(-state.historyLimit),
        currentRoute: action.payload.path,
      };

    case ACTION_TYPES.OPEN_MODAL: {
      const modalEntry = createEntry(NAV_TYPES.MODAL, action.payload);
      return {
        ...state,
        history: [...state.history, modalEntry].slice(-state.historyLimit),
        activeModals: [...state.activeModals, modalEntry],
      };
    }
    case ACTION_TYPES.CLOSE_MODAL:
      return {
        ...state,
        activeModals: state.activeModals.filter((modal) => modal.id !== action.payload.modalId),
      };

    case ACTION_TYPES.SWITCH_TAB:
      return {
        ...state,
        history: [...state.history, createEntry(NAV_TYPES.TAB, action.payload)].slice(-state.historyLimit),
        currentTab: action.payload.tabId,
      };

    case ACTION_TYPES.SIDEBAR_NAVIGATE:
      return {
        ...state,
        history: [...state.history, createEntry(NAV_TYPES.SIDEBAR, action.payload)].slice(-state.historyLimit),
        sidebarState: action.payload.path,
      };

    case ACTION_TYPES.CLEAR_HISTORY:
      return {
        ...state,
        history: [],
        activeModals: [],
      };

    default:
      return state;
  }
};

// Initial state
const initialState: NavigationState = {
  history: [],
  activeModals: [],
  currentRoute: '/',
  currentTab: null,
  sidebarState: null,
  historyLimit: 100,
};

// Create context
const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

// Custom hook to use the context
export const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Provider component that integrates with React Router
export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children, historyLimit = 100 }) => {
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialState,
    historyLimit,
  });

  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Track React Router navigation
  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.ROUTE_CHANGE,
      payload: {
        path: location.pathname,
        title: document.title || 'Page',
      },
    });
  }, [location.pathname]);

  // Navigation functions
  const navigateToRoute = useCallback(
    (path: string): void => {
      navigate(path); // React Router handles the actual navigation
      // Our context will automatically track it via useEffect above
    },
    [navigate]
  );

  const openModal = useCallback(
    (modalId: string, title: string, data: Record<string, object> = {}): void => {
      dispatch({
        type: ACTION_TYPES.OPEN_MODAL,
        payload: { modalId, title, data, parentRoute: location.pathname },
      });
    },
    [location.pathname]
  );

  const closeModal = useCallback((modalId: string): void => {
    dispatch({
      type: ACTION_TYPES.CLOSE_MODAL,
      payload: { modalId },
    });
  }, []);

  const switchTab = useCallback(
    (tabId: string, title: string, data: Record<string, object> = {}): void => {
      dispatch({
        type: ACTION_TYPES.SWITCH_TAB,
        payload: { tabId, title, data, route: location.pathname },
      });
    },
    [location.pathname]
  );

  const sidebarNavigate = useCallback(
    (path: string, title: string, data: Record<string, object> = {}): void => {
      dispatch({
        type: ACTION_TYPES.SIDEBAR_NAVIGATE,
        payload: { path, title, data, route: location.pathname },
      });
    },
    [location.pathname]
  );

  const clearHistory = useCallback((): void => {
    dispatch({ type: ACTION_TYPES.CLEAR_HISTORY });
  }, []);

  // Analytics functions
  const getNavigationStats = useCallback((): NavigationStats => {
    const stats: NavigationStats = {
      totalNavigations: state.history.length,
      routeNavigations: state.history.filter((h) => h.type === NAV_TYPES.ROUTE).length,
      tabSwitches: state.history.filter((h) => h.type === NAV_TYPES.TAB).length,
      modalOpens: state.history.filter((h) => h.type === NAV_TYPES.MODAL).length,
      sidebarNavigations: state.history.filter((h) => h.type === NAV_TYPES.SIDEBAR).length,
      activeModals: state.activeModals.length,
      currentRoute: state.currentRoute,
      currentTab: state.currentTab,
    };
    return stats;
  }, [state]);

  const getRecentHistory = useCallback(
    (count: number = 10): NavigationEntry[] => {
      return state.history.slice(-count);
    },
    [state.history]
  );

  const contextValue: NavigationContextValue = {
    // State
    history: state.history,
    activeModals: state.activeModals,
    currentRoute: state.currentRoute,
    currentTab: state.currentTab,
    sidebarState: state.sidebarState,

    // Navigation functions
    navigateToRoute,
    openModal,
    closeModal,
    switchTab,
    sidebarNavigate,
    clearHistory,

    // Analytics functions
    getNavigationStats,
    getRecentHistory,

    // Constants
    NAV_TYPES,
  };

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>;
};

// Demo component showing integration
const AppDemo: React.FC = () => {
  const {
    activeModals,
    currentRoute,
    currentTab,
    navigateToRoute,
    openModal,
    closeModal,
    switchTab,
    sidebarNavigate,
    getNavigationStats,
    getRecentHistory,
    NAV_TYPES,
  } = useNavigation();

  const stats = getNavigationStats();
  const recentHistory = getRecentHistory(5);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">React Router + Navigation Context Demo</h1>

      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Current State</h3>
        <div className="text-sm space-y-1">
          <div>Route: {currentRoute}</div>
          <div>Tab: {currentTab || 'None'}</div>
          <div>Active Modals: {activeModals.length}</div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mb-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">React Router Navigation (URL changes)</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigateToRoute('/home')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => navigateToRoute('/profile')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Profile
            </button>
            <button
              onClick={() => navigateToRoute('/settings')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Settings
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">UI Navigation (no URL change)</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => switchTab('dashboard', 'Dashboard')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Dashboard Tab
            </button>
            <button
              onClick={() => switchTab('analytics', 'Analytics')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Analytics Tab
            </button>
            <button
              onClick={() => openModal('user-details', 'User Details')}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Open Modal
            </button>
            <button
              onClick={() => sidebarNavigate('/quick-actions', 'Quick Actions')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Sidebar Action
            </button>
          </div>
        </div>
      </div>

      {/* Active Modals */}
      {activeModals.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 rounded">
          <h3 className="font-semibold mb-2">Active Modals</h3>
          <div className="space-y-2">
            {activeModals.map((modal: NavigationEntry) => (
              <div key={modal.id} className="flex items-center justify-between p-2 bg-white rounded">
                <span>{modal.title}</span>
                <button
                  onClick={() => closeModal(modal.modalId!)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Navigation Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>Total: {stats.totalNavigations}</div>
          <div>Routes: {stats.routeNavigations}</div>
          <div>Tabs: {stats.tabSwitches}</div>
          <div>Modals: {stats.modalOpens}</div>
          <div>Sidebar: {stats.sidebarNavigations}</div>
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h3 className="font-semibold mb-2">Recent Navigation History</h3>
        <div className="space-y-2">
          {recentHistory.map((entry: NavigationEntry) => (
            <div key={entry.id} className="p-3 bg-white rounded border">
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      entry.type === NAV_TYPES.ROUTE
                        ? 'bg-blue-100 text-blue-800'
                        : entry.type === NAV_TYPES.TAB
                          ? 'bg-purple-100 text-purple-800'
                          : entry.type === NAV_TYPES.MODAL
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {entry.type.toUpperCase()}
                  </span>
                  <span className="ml-2 font-medium">{entry.title}</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// App with proper integration
const App: React.FC = () => {
  return (
    <NavigationProvider historyLimit={100}>
      <AppDemo />
    </NavigationProvider>
  );
};

export default App;
