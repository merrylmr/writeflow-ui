import PropTypes from 'prop-types'
import {Handle, Position, useUpdateNodeInternals} from 'reactflow'
import {useState, useEffect, useRef, useContext} from 'react'

import {flowContext} from "@/store/context/ReactFlowContext";
import {isValidConnection} from '@/utils/genericHelper'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// ui-components
import InputComp from '../ui-components/input/Index'
import TextAreaComp from '../ui-components/textarea/Textarea'
import {Switch} from "@/components/ui/switch"

import {Maximize, Trash2} from 'lucide-react'

//  labelComp
import LabelComp from '../ui-components/label/Index'
//  type
import {INodeParams, INodeData} from '../../custom_types/index'

function NodeInputHandler({data, inputParam, deleteInputAnchor, changeParam}: {
    data: INodeData,
    disabled?: boolean,
    inputParam: INodeParams,
    deleteInputAnchor?: () => void,
    changeParam?: (node: INodeParams) => void

}) {
    const [position, setPosition] = useState(0)
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()
    const {reactFlowInstance} = useContext(flowContext)
    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const onExpandDialogClicked = () => {
        setShowExpandDialog(true)
    }
    const showDisplay = (type: string) => {
        const newType = type.split('/')[0]
        return newType
    }
    const displayType = showDisplay(inputParam.display_type || inputParam.type);
    const changeInputParamValue = (v: any) => {
        changeParam && changeParam({...inputParam, value: v})
    }


    useEffect(() => {
        if (ref.current) {
            const dom = ref.current as HTMLElement
            if (dom.offsetTop && dom.clientHeight) {
                setPosition(dom.offsetTop + dom.clientHeight / 2)
                updateNodeInternals(data.id)
            }
        }

    }, [data.id, ref, updateNodeInternals])
    useEffect(() => {
        updateNodeInternals(data.id)
    }, [data.id, position, updateNodeInternals])
    return <div ref={ref}>
        {inputParam && inputParam.input_type === 'anchor' && (
            <>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Handle
                                type='target'
                                position={Position.Left}
                                key={inputParam.key}
                                id={inputParam.key}
                                isConnectable={true}
                                isValidConnection={(connection) => isValidConnection(connection, inputParam, 'target', reactFlowInstance)}
                                style={{
                                    height: 10,
                                    width: 10,
                                    top: position
                                }}
                            />
                        </TooltipTrigger>
                        <TooltipContent side="left" align="center">
                            {inputParam.type}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="p-2">
                    <div className="flex items-center justify-between  group">
                        <LabelComp name={inputParam.name} defaultValue={inputParam.key} className="ml-2"></LabelComp>
                        {inputParam.dynamic && <Trash2
                            className="group-hover:opacity-100 opacity-0"
                            onClick={() => deleteInputAnchor && deleteInputAnchor()}
                        ></Trash2>}
                    </div>
                </div>
            </>
        )}
        {inputParam && inputParam.input_type !== 'anchor' &&
            <>
                <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                        <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>

                        {['code', 'textarea'].includes(displayType) &&
                            <Maximize
                                onClick={onExpandDialogClicked}
                                className="w-5 h-4  cursor-pointer hover:bg-secondary"/>}
                    </div>
                    {(() => {
                        switch (displayType) {
                            case 'text':
                            case 'number':
                            case 'password':
                            default:
                                return <InputComp
                                    displayType={displayType}
                                    inputParam={inputParam}
                                    onChange={(newValue) => (inputParam.value = newValue)}
                                    value={inputParam.value ?? inputParam.value ?? ''}
                                />
                            case 'textarea':
                            case 'code':
                                return <TextAreaComp
                                    inputParam={inputParam}
                                    onChange={(newValue) => (inputParam.value = newValue)}
                                    value={inputParam.value ?? inputParam.value ?? ''}
                                    showDlg={showExpandDialog}
                                    onDialogCancel={() => {
                                        setShowExpandDialog(false)
                                    }}
                                ></TextAreaComp>
                            case 'bool':
                                return <Switch checked={inputParam.value as boolean}
                                               onCheckedChange={(newValue) => changeInputParamValue(newValue)}
                                ></Switch>
                        }
                    })()}
                </div>
            </>}
    </div>
}

NodeInputHandler.propTypes = {
    inputAnchor: PropTypes.object,
    inputParam: PropTypes.object,
    data: PropTypes.object,
    disabled: PropTypes.bool,
    isAdditionalParams: PropTypes.bool
}

export default NodeInputHandler