import React from 'react';
import { connect } from 'dva';
const namespace = 'list';

//说明，第一个回调函数的作用：将page层和model层进行链接，返回model中的数据
//并且将返回的数据绑定到this.props中

@connect(
  state => {
    return {
      dataList: state[namespace].data,
      maxNum: state[namespace].maxNum,
    };
  },
  dispatch => {
    //定义方法，dispatch是内置函数，可以调用model层定义的函数
    return {
      //将返回的函数绑定到this.props中
      add: () => {
        dispatch({
          //通过dispatch调用model中定义的函数，通过type指定函数名，格式:namespace/函数名
          type: namespace + '/addNewData',
        });
      },
      init: () => {
        dispatch({
          type: namespace + '/initData',
        });
      },
    };
  }
)
class List extends React.Component {
  componentDidMount() {
    this.props.init();
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.dataList.map((value, index) => {
            return <li key={index}>{value}</li>;
          })}
        </ul>
        <button
          onClick={() => {
            this.props.add();
          }}
        >
          点我
        </button>
      </div>
    );
  }
}

export default List;
