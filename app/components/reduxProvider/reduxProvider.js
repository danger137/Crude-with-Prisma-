"use client";

import { meraStore } from "@/store/store"
import { Provider } from "react-redux";

export default function ReduxProvider({children}){

  return <Provider store={meraStore}>
        {children}
  </Provider>

}