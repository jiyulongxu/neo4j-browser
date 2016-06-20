import React from 'react'
import { FrameTitlebar } from './FrameTitlebar'
import asciitable from 'ascii-data-table'
import bolt from '../../../services/bolt/bolt'
// import tabNavigation from '../../../tabNavigation'
import neo4jVisualization from 'neo4j-visualization'

class CypherFrame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openView: 'text'
    }
  }

  onNavClick (viewName) {
    this.setState({openView: viewName})
  }
  render () {
    const frame = this.props.frame
    const errors = frame.errors && frame.errors.fields || false
    const result = frame.result || false
    let frameContents = <pre>{JSON.stringify(result, null, 2)}</pre>
    if (result) {
      const nodesAndRelationships = bolt.extractNodesAndRelationshipsFromRecords(result.records)
      if (nodesAndRelationships.nodes.length > 0) {
        frameContents = (
          <div className='frame'>
            <neo4jVisualization.GraphComponent useContextMenu={true} nodes={nodesAndRelationships.nodes} relationships={nodesAndRelationships.relationships}/>
          </div>
        )
      } else {
        const rows = bolt.recordsToTableArray(result.records)
        frameContents = <pre>{asciitable.run(rows)}</pre>
      }
    } else if (errors) {
      frameContents = (
        <div>
          {errors[0].code}
          <pre>{errors[0].message}</pre>
        </div>
      )
    }
    return (
      <div className='frame'>
        <FrameTitlebar frame={frame} />
        <div className='frame-contents'>{frameContents}</div>
      </div>
    )
  }
}

export {
  CypherFrame
}