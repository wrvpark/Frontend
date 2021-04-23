import React from 'react'
import './index.less'
//declare a function LinkButton component
export default function LinkButton(props) {
    //{...props} loads all props from the parent component
    return <button {...props} className='link-button'></button>
}
