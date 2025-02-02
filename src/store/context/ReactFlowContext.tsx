import {createContext, ReactNode, useState} from 'react'
import {ReactFlowInstance} from 'reactflow'
import {INodeData} from "../../custom_types";


export interface NodeStatus {
    status: "running" | "failed" | "success",
    result?: Record<string, any>,
    error?:string
}

export const flowContext = createContext({
    reactFlowInstance: {} as ReactFlowInstance,
    runResult: {} as Record<string, NodeStatus>,
    setReactFlowInstance: (instance: ReactFlowInstance): void => {
    },
    updateNodeData: (id: string, data: INodeData): void => {
    },
    setRunResult: (result: any): void => {
    },
    deleteEdge: (id: string): void => {}
})


export const ReactFlowContext = ({children}: { children: ReactNode }) => {
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>({} as ReactFlowInstance)
    const [runResult, setRunResult] = useState<{ [propName: string]: any; }>({})
    const updateNodeData = (id: string, data: INodeData) => {
        console.log('updateNodeData:', id, data);
        reactFlowInstance.setNodes((prevNodes) => {
            return prevNodes.map((node) => {
                console.log('updateNodeData node:', node, id, node.id === id);
                if (node.id === id) {
                    node.data = data
                }
                return node
            })
        })
    }

    const deleteEdge = (id: string) => {
        reactFlowInstance.setEdges(reactFlowInstance.getEdges().filter((edge) => edge.id !== id))
    }
    return (
        <flowContext.Provider
            value={{
                reactFlowInstance,
                runResult,
                setReactFlowInstance,
                updateNodeData,
                setRunResult,
                deleteEdge
            }}
        >
            {children}
        </flowContext.Provider>
    )
}