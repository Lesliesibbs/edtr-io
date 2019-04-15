import { CustomTheme } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Theming', module).add('Custom Theme', () => {
  const state = {
    plugin: 'rows',
    state: [{ plugin: 'text' }]
  }

  const theme: CustomTheme = {
    editor: {
      color: '#222',
      backgroundColor: '#d9edf7',
      primary: {
        background: '#007ec1'
      }
    },
    editorUi: {
      button: {
        color: 'green',
        backgroundColor: 'red',
        hoverBackgroundColor: 'green',
        hoverBorderColor: 'green'
      },
      checkbox: {
        boxSelectedColor: 'green',
        boxDeselectedColor: 'red',
        color: 'green'
      },
      input: {
        color: 'red',
        backgroundColor: 'green',
        highlightColor: 'black'
      },
      textarea: {
        color: 'red',
        backgroundColor: 'green',
        highlightColor: 'black'
      }
    },
    rendererUi: {
      expandableBox: {
        toggleBorderColor: 'red'
      }
    }
  }

  return <EditorStory defaultPlugin="text" initialState={state} theme={theme} />
})
