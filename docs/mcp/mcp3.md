---
prev:
    text: 'MCP 서버 구현기 (2)'
    link: '/docs/mcp/mcp2'
next:
    text: 'MCP 서버 구현기 (3)'
    link: '/docs/mcp/mcp3'
---

# MCP 서버 구현기 (2)

지난 포스팅에서 AI Agent 와 MCP 서버를 연동해보았다.  
예제 코드를 보며 MCP 서버의 주요 기능에 대해 알아보자.

::: details 예제 코드 {close}

```ts [src/server.ts]
import {
    McpServer,
    ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Create an MCP server
const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0',
});

// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
    })
);

// Add a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource', // Display name for UI
        description: 'Dynamic greeting generator',
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}!`,
            },
        ],
    })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport);
```

:::

MCP 서버는 세 가지 기본 구성 요소를 제공한다.

1. Tools
2. Resource
3. Prompts

## Tools

도구란, LLM이 호출할 수 있는 기능을 의미한다.  
데이터 베이스 쿼리, API 호출, 계산 등 다양한 작업을 수행할 수 있다.

LLM 은 사용자의 프롬프트를 통해 상황을 이해하고, 도구를 알아서 검색하고 호출한다.

```ts [src/server.ts]
// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
    })
);
```

위 코드는, 예제 코드의 도구 등록 부분이다.  
[`registerTool`](https://github.com/modelcontextprotocol/typescript-sdk/blob/4a63974049e27efb3c99325b29454127eed33adf/src/server/mcp.ts#L923) 이라는 메서드를 사용했는데, 메서드 정의는 아래와 같다.

```ts [mcp.d.ts]
/**
* Registers a tool with a config object and callback.
*/
registerTool<InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape>(name: string, config: {
    title?: string;
    description?: string;
    inputSchema?: InputArgs;
    outputSchema?: OutputArgs;
    annotations?: ToolAnnotations;
}, cb: ToolCallback<InputArgs>): RegisteredTool;
```

하나하나 뜯어보며 코드를 이해해보자.

```ts [src/server.ts]
// Add an addition tool
server.registerTool(
    'add', // [!code ++]
    {
        title: 'Addition Tool', // [!code ++]
        description: 'Add two numbers', // [!code ++]
        inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
    })
);
```

먼저, 이 도구의 이름은 `add` 이고, 두 수를 더하는 기능을 한다.

```ts [src/server.ts]
// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() }, // [!code ++]
    },
    async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
    })
);
```

`inputSchema` 를 보면 `a` 와 `b` 라는 두 개의 숫자형 인자를 받는 것을 알 수 있다.  
여기서 `z` 는 `zod` 라이브러리이다. `zod` 는 타입스크립트에서 런타임 스키마를 정의/검증한다.
`z.number()` 는 숫자형 값을 나타내는 스키마를 정의한다.  
즉, `inputSchema` 에 정의된 `a` 와 `b` 는 모두 숫자형 값이어야 한다는 의미이다.

```ts [src/server.ts]
// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
        // [!code ++]
        content: [{ type: 'text', text: String(a + b) }], // [!code ++]
    }) // [!code ++]
);
```

콜백 부분을 보면,

## Resources

## Prompts

프롬프트는 LLM 에게 미리 준비된 지시사항을 제공하는 기능이다.

프롬프트는 서버가 클라이언트에 프롬프트 템플릿을 노출하는 표준화된 방식을 제공한다.
프롬프트르 통해 서버는 언어 모델과 상호 작용하기 위한 구조화된 메시지와 지침을 제공할 수 있다.  
클라이언트는 사용 가능한 프롬프트를 검색하고, 내용을 가져오고, 인수를 제공하여 프롬프트를 사용자 지정할 수 있다.

## Transports

```ts [src/server.ts]
// Create an MCP server
const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0',
});

// ...생략

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport);
```

서버 시작 부분을 보면, `StdioServerTransport` 를 `connect` 의 인자로 전달하고 있다.  
`StdioServerTransport` 란 무엇일까?

Transports 란, <b>MPC 클라이언트와 MPC 서버 간의 통신 방법을 정의하는 계층(프로토콜)</b>이다.  
현 MCP 는 두 가지 Transports 를 제공한다.

1. stdio (Standard Input/Output) Transports
2. Streamable https

### stdio (Standard Input/Output) Transports

표준 입력/출력을 통한 통신이다.  
가장 간단하고 일반적인 방식이다.
