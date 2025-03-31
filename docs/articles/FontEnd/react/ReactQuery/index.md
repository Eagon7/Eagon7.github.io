# React Query

## 出现背景/解决问题

**灵魂拷问Q： 为什么用axios不可以 为什么需要出现React Query**

A:尽管可以使用普通的 Axios 或其他数据获取库来处理数据请求，但在某些情况下，使用 React Query 可以带来更多的好处和便利性：

- [自动缓存和数据同步](#自动缓存和数据同步)： React Query 自带数据缓存和自动刷新功能，它会自动缓存数据并定期刷新以保持数据的最新状态。这减少了手动管理缓存的复杂性

- [加载状态管理](#加载状态管理 ) ： React Query内置状态管理，你可以不用再写isLoading isFetching等状态了，它会自动管理数据加载状态。

- [数据同步和预取](#数据同步和预取)： React Query 支持数据预取和自动同步，提前获取数据并在后台刷新，以保持数据最新。这在提高用户体验和性能方面很有帮助。

- [自动缓存失效处理](#自动缓存失效处理)： 当数据过期或需要刷新时，React Query 可以自动处理缓存失效并重新获取数据，无需手动编写过期和刷新逻辑。

- [服务器状态更新](#服务器状态更新)： 对于需要与服务器状态同步的情况，React Query 可以通过提供的无缝数据同步功能来处理，确保客户端数据的一致性。

- [更少的重复代码](#更少的重复代码)： 使用 React Query，你可以通过一些简单的 hooks 和配置来处理数据获取和管理，减少了编写重复代码的工作量。

总之，尽管可以使用普通的数据获取库来处理数据请求，但 React Query 提供了一整套功能，可以更好地管理数据获取、缓存、状态以及用户体验等方面的问题，从而减少了开发工作量并提供了更好的性能和用户体验。

## 核心概念

解决普通请求代码重复，后期维护困难。无数据缓存，无数据同步，无数据预取，无数据失效处理，无服务器状态更新等问题。

## 使用教程

### 自动缓存和数据同步

### 加载状态管理

### 数据同步和预取

### 自动缓存失效处理

### 服务器状态更新

### 更少的重复代码

::: code-group

``` tsx [befor.tsx]
import * as React from 'react';
​
export default function App() {
  // 存储 后端返回数据
  const [zen, setZen] = React.useState('');
  // 存储 加载状态
  const [isLoading, setIsLoading] = React.useState(false);
  // 存储 是否请求成功
  const [isError, setIsError] = React.useState(false);
  // 存储 后端返回的错误数据
  const [errorMessage, setErrorMessage] = React.useState('');
​
  const fetchData = () => {
    // 开始获取数据，将isLoading置为true
    setIsLoading(true);
​
    fetch('https://api.github.com/zen')
      .then(async (response) => {
        // 如果请求返回status不为200 则抛出后端错误
        if (response.status !== 200) {
          const { message } = await response.json();
​
          throw new Error(message);
        }
​
        return response.text();
      })
      .then((text: string) => {
        // 请求完成将isLoading置为false
        setIsLoading(false);
        // 接口请求成功，将isError置为false
        setIsError(false);
        // 存储后端返回的数据
        setZen(text);
      })
      .catch((error) => {
        // 请求完成将isLoading置为false
        setIsLoading(false);
        // 接口请求错误，将isError置为true
        setIsError(true);
        // 存储后端返回的错误数据
        setErrorMessage(error.message);
      });
  };
​
  React.useEffect(() => {
    // 初始化请求数据
    fetchData();
  }, []);
​
  return (
    <div>
      <h1>Zen from Github</h1>
      <p>{isLoading ? '加载中...' : isError ? errorMessage : zen}</p>
      {!isLoading && (
        <button onClick={fetchData}>{isError ? '重试' : '刷新'}</button>
      )}
    </div>
  );
}
​

```

``` tsx [after.tsx]
import * as React from 'react';
import { useQuery } from 'react-query';
​
const fetchData = ({ queryKey }) => {
  console.log(queryKey)
  const [, owner, repo] = queryKey;
​
  return fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    headers: {
      Authorization: '',
    },
  }).then(async (response) => {

    if (response.status !== 200) {
      const { message } = await response.json();
      throw new Error(message);
    }
    return response.json();
  });
};
​
export default function App() {
  const [inputOwner, setInputOwner] = React.useState('facebook');
  const [inputRepo, setInputRepo] = React.useState('react');
  const [queryKey, setQueryKey] = React.useState([inputOwner, inputRepo]);

  const issueQuery = useQuery(['issues', ...queryKey], fetchData);
​
  return (
    <div>
      <span>仓库：</span>
      <input
        name={'owner'}
        value={inputOwner}
        onChange={(e) => setInputOwner(e.target.value)}
      />
      /
      <input
        name={'repo'}
        value={inputRepo}
        onChange={(e) => setInputRepo(e.target.value)}
      />
      <button
        onClick={() => {
          setQueryKey([inputOwner, inputRepo]);
        }}
      >
        查看最新issue信息
      </button>
      <div>
        <h1>
          仓库{queryKey[0]}/{queryKey[1]}最新一条issue信息
        </h1>
        <p>
          {issueQuery.isLoading
            ? '加载中...'
            : issueQuery.isError
            ? issueQuery.message
            : JSON.stringify(issueQuery.data[0])}
        </p>
      </div>
    </div>
  );
}
​

```

:::

## API

| APIname        |      Are      |
| ------------- | :-----------: |
|data：     | 查询返回的数据 |
| isLoading：      |   表示查询是否正在加载中。如果数据正在加载，该属性为 true；否则为 false。  |
| isError： |   表示查询是否遇到了错误。如果查询出现错误，该属性为 true；否则为 false。    |
|error： |如果查询出现错误，该属性将包含错误信息。通常是一个错误对象，包含有关查询错误的详细信息。 |
|status： | 表示查询的状态，用于指示加载中、成功或错误状态。例如，可以是字符串  "loading"、"success" 或 "error"。|
|isSuccess： |表示查询是否成功完成。如果查询成功完成，该属性为 true；否则为 false。 |
| isFetching：|表示是否正在获取数据，无论是从远程服务器还是从缓存中。如果正在获取数据，该属性为 true；否则为 false。 |
|dataUpdatedAt： |表示数据上次更新的时间戳。 |
|refetch： |用于手动重新获取数据的函数。 |

## 总结
