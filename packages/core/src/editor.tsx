import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { Document, DocumentIdentifier } from './document'
import { EditorContext } from './editor-context'
import { ActionType, reducer } from './store'
import { Plugin } from './plugin'

export function Editor<K extends string = string>(props: EditorProps<K>) {
  const baseState = {
    ...props,
    documents: {}
  }
  const [state, dispatch] = React.useReducer(reducer, {
    ...baseState,
    history: {
      initialState: baseState,
      actions: [],
      redoStack: []
    }
  })

  return (
    <HotKeys
      keyMap={{
        UNDO: 'mod+z',
        REDO: ['mod+y', 'mod+shift+z']
      }}
      handlers={{
        UNDO: () =>
          dispatch({
            type: ActionType.Undo
          }),
        REDO: () =>
          dispatch({
            type: ActionType.Redo
          })
      }}
    >
      <EditorContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        <Document state={props.state} />
        {props.children}
      </EditorContext.Provider>
    </HotKeys>
  )
}

export interface EditorProps<K extends string = string> {
  children?: React.ReactNode
  plugins: Record<K, Plugin>
  defaultPlugin: K
  state: DocumentIdentifier
}
