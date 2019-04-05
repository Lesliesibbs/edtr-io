import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { Document } from './document'
import {
  ActionType,
  reducer,
  createInitialState,
  getRoot,
  pendingChanges,
  State,
  PluginState,
  InitRootAction,
  SwitchEditableAction,
  UndoAction,
  RedoAction,
  CopyAction
} from './store'
import { Plugin } from './plugin'
import { OverlayContextProvider } from './overlay'
import { createStore as createReduxStore } from 'redux'
import { connect, Provider } from 'react-redux'

export const createStore = <K extends string>(
  plugins: Record<K, Plugin>,
  defaultPlugin: K,
  editable: boolean
) =>
  createReduxStore(
    reducer,
    createInitialState(plugins, defaultPlugin, editable)
  )

export function Editor<K extends string = string>({
  plugins,
  defaultPlugin,
  initialState,
  changed,
  children,
  editable = true
}: EditorProps<K>) {
  const store = createStore(plugins, defaultPlugin, editable)

  const editorProps = {
    initialState,
    changed,
    children,
    editable
  }
  return (
    <Provider store={store}>
      <EditorProvider {...editorProps} />
    </Provider>
  )
}

const mapStateToProps = (state: State): StateProps => ({
  root: getRoot(state),
  pendingChanges: pendingChanges(state)
})

const initRoot = (payload: {
  plugin?: string
  state?: unknown
}): InitRootAction => ({ type: ActionType.InitRoot, payload })
const switchEditable = (payload: boolean): SwitchEditableAction => ({
  type: ActionType.SwitchEditable,
  payload
})
const undo = (): UndoAction => ({ type: ActionType.Undo })
const redo = (): RedoAction => ({ type: ActionType.Redo })
export const copyToClipboard = (payload: string): CopyAction => ({
  type: ActionType.CopyToClipboard,
  payload
})

const mapDispatchToProps: StateDispatchProps = {
  initRoot,
  switchEditable: switchEditable,
  undo: undo,
  redo: redo
}

export const EditorProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorConnector)

export function EditorConnector<K extends string = string>({
  initialState,
  changed,
  children,
  editable = true,
  root,
  pendingChanges,
  initRoot,
  switchEditable,
  undo,
  redo
}: EditorConnectorProps & StateProps & StateDispatchProps) {
  React.useEffect(() => {
    initRoot(initialState || {})
  }, [initRoot, initialState])

  React.useEffect(() => {
    switchEditable(editable)
  }, [editable, switchEditable])

  const previousPendingChanges = React.useRef(0)
  React.useEffect(() => {
    if (changed && previousPendingChanges.current !== pendingChanges) {
      previousPendingChanges.current = pendingChanges
      changed(pendingChanges !== 0)
    }
  }, [changed, pendingChanges])

  if (!root) {
    return null
  }

  return (
    <HotKeys
      keyMap={{
        UNDO: 'mod+z',
        REDO: ['mod+y', 'mod+shift+z']
      }}
      handlers={{
        UNDO: undo,
        REDO: redo
      }}
    >
      <div style={{ position: 'relative' }}>
        <OverlayContextProvider>{renderChildren(root)}</OverlayContextProvider>
      </div>
    </HotKeys>
  )

  function renderChildren(id: string) {
    const document = <Document id={id} />

    if (typeof children === 'function') {
      return children(document)
    }

    return (
      <React.Fragment>
        {document}
        {children}
      </React.Fragment>
    )
  }
}

export interface EditorProps<K extends string = string> {
  children?: React.ReactNode | ((document: React.ReactNode) => React.ReactNode)
  plugins: Record<K, Plugin>
  defaultPlugin: K
  initialState?: PluginState
  changed?: (changed: boolean) => void
  editable?: boolean
}

export interface EditorConnectorProps {
  children?: React.ReactNode | ((document: React.ReactNode) => React.ReactNode)
  initialState?: PluginState
  changed?: (changed: boolean) => void
  editable?: boolean
}

export interface StateProps {
  root?: string
  pendingChanges: number
}

export interface StateDispatchProps {
  initRoot: (payload: { plugin?: string; state?: unknown }) => InitRootAction
  switchEditable: (payload: boolean) => SwitchEditableAction
  undo: () => UndoAction
  redo: () => RedoAction
}
