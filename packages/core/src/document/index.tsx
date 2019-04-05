import * as React from 'react'

import { DocumentEditor } from './editor'
import { DocumentRenderer } from './renderer'
import {
  ActionType,
  ChangeAction,
  FocusAction,
  getDocument,
  getPlugin,
  isEditable,
  isFocused,
  PluginState,
  State
} from '../store'
import { Plugin } from '@edtr-io/core'
import { connect } from 'react-redux'
import { Row } from '@edtr-io/plugin-rows/src/row'

export const Document: React.FunctionComponent<
  DocumentProps & DocumentStateProps
> = props => {
  return props.isEditable ? (
    <DocumentEditor {...props} />
  ) : (
    <DocumentRenderer {...props} />
  )
}

export interface DocumentProps {
  id: string
  pluginProps?: Record<string, unknown>
}

const mapStateToProps = (state: State): DocumentStateProps => ({
  isEditable: isEditable(state),
  isFocused: (id: string) => isFocused(state, id),
  getDocument: (id: string) => getDocument(state, id),
  getPlugin: (type: string) => getPlugin(state, type)
})

const focus = (payload: string): FocusAction => ({
  type: ActionType.Focus,
  payload
})
const change = (payload: ChangeAction['payload']): ChangeAction => ({
  type: ActionType.Change,
  payload
})

const mapDispatchToProps: DocumentDispatchProps = {
  focus,
  change
}

export const DocumentProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Row)

export interface DocumentStateProps {
  isEditable: boolean
  isFocused: (id: string) => boolean
  getDocument: (id: string) => PluginState | null
  getPlugin: (type: string) => Plugin | null
}

export interface DocumentDispatchProps {
  focus: typeof focus
  change: typeof change
}
