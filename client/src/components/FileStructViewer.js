import React from 'react';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const _ = require('lodash')
const Demo = (props) => {
  
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

    return (
      <div>

        {props.nodesTree &&  
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={[
              props.nodesTree
            ]}
          />
        }
      </div>
    );
}

export default Demo