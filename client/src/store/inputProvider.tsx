'use client';
import { useState, createContext, useContext } from 'react';
import { create } from 'zustand';

const createStore = (input: string) =>
  create<{
    input: string;
    setInput: (Input: string) => void;
  }>((set) => ({
    input,
    setInput(input: string) {
      set({ input });
    },
  }));

const InputContext = createContext<ReturnType<typeof createStore>>(null!);

export const useInput = () => {
  if (!InputContext)
    throw new Error('useInput must be used within a InputProvider');
  return useContext(InputContext);
};

const InputProvider = ({
  input,
  children,
}: {
  input: string;
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createStore(input));
  return (
    <InputContext.Provider value={store}>{children}</InputContext.Provider>
  );
};

export default InputProvider;
