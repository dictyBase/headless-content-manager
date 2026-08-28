```mermaid
flowchart TD

X[Root]
A[Flex Container]
C[paragraph]
D[heading]
E[list]
F[listitem]
G[image-node]
H[Link]
I[Quote]
Z[Text]


X --> A
A --> C
A --> G

C --> Z
C --> H
H --> Z

A --> E
E --> F
F --> Z

A --> I
I --> Z

A --> D
D --> Z
```
