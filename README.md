# sign_name

## 签名插件安装

```
npm i sign_name
```

### 插件的使用

```
在入口文件main.js中使用

import signName from "sign_name";
import 'sign_name/lib/sign_name.css'

Vue.use(signName);
```

### 说明文档 -- 属性

| 属性      | 说明               | 默认值              |
| --------- | ------------------ | ------------------- |
| landscape | 是否设置为横屏模式 | Boolean \| true     |
| color     | 线条颜色           | String \| #000      |
| lineWidth | 线条宽度           | String Number \| 3  |
| lineMax   | 线条最大宽度       | String Number \| 10 |
| lineMin   | 线条最小宽度       | String Number \| 3  |

### 说明文档 -- 事件

| 事件    | 说明                                                         | 返回值        |
| ------- | ------------------------------------------------------------ | ------------- |
| on-save | 点击保存按钮触发的事件,有签名时返回文件流 无签名时返回 false | file \| false |

[查看详情](https://github.com/Zhoushunshun541/sign_name).
