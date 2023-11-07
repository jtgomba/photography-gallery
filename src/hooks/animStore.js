import { create } from "zustand";

const useAnim = create((set, get) => ({
  properties: {
    // Content instances
    contentItems: [],
    // Check is Slishow is in open mode or closed mode
    isOpen: false,
    // Current item's position
    current: -1,
    // Total items
    totalItems: 10,
    currentItem: {},
    reactRefs: new Map(),
  },
  actions: {
    setOpen: (e) =>
      set((state) => ({
        properties: { ...state.properties, isOpen: e },
      })),
    setCurrent: (e) =>
      set((state) => ({
        properties: { ...state.properties, current: e },
      })),
    setCurrentItem: (e) =>
      set((state) => ({
        properties: { ...state.properties, currentItem: e },
      })),
    addReactRef: (key, val) => {
      set((state) => ({
        properties: {
          ...state.properties,
          reactRefs: new Map(get().properties.reactRefs).set(key, val),
        },
      }));
    },
  },
}));

export const useAnimProps = () => useAnim((s) => s.properties);
export const useAnimActions = () => useAnim((s) => s.actions);
//Somewhere in a component
//const { going } = useStoreProps();
//const { setGoing } = useStoreActions();
