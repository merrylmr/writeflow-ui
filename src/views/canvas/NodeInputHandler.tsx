import PropTypes from 'prop-types'
import {Box, Tooltip} from "@mui/material";
import {useTheme, styled} from '@mui/material/styles'
import {tooltipClasses} from '@mui/material/Tooltip'
import {Handle, Position, useUpdateNodeInternals} from 'reactflow'
import {useState, useEffect, useRef} from 'react'
import {Input} from '../ui-components/input/Index'

const CustomWidthTooltip = styled(({className, ...props}: any) => <Tooltip {...props} classes={{popper: className}}/>)({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500
    }
})


//  labelComp
import LabelComp from '../ui-components/label/Index'
//  type
import {INodeParams, INodeData} from '../../custom_types/index'

function NodeInputHandler({inputAnchor, data, disabled = false, inputParam}: {
    inputAnchor?: INodeParams,
    data: INodeData,
    disabled?: boolean,
    inputParam?: INodeParams

}) {
    const theme = useTheme()
    const [position, setPosition] = useState(0)
    const ref = useRef(null)
    const updateNodeInternals = useUpdateNodeInternals()

    useEffect(() => {
        if (ref.current) {
            const dom = ref.current as HTMLElement
            if (dom.offsetTop && dom.clientHeight) {
                setPosition(dom.offsetTop + dom.clientHeight / 2)
                updateNodeInternals(data.id)
            }
        }

    }, [data.id, ref, updateNodeInternals])
    return <div ref={ref}>
        {inputAnchor && (
            <>
                <CustomWidthTooltip placement='left' title={inputAnchor.type}>
                    <Handle
                        type='target'
                        position={Position.Left}
                        key={inputAnchor.key}
                        id={inputAnchor.key}
                        style={{
                            height: 10,
                            width: 10,
                            backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                            top: position
                        }}
                    />
                </CustomWidthTooltip>
                <Box sx={{p: 2}}>
                    <LabelComp name={inputAnchor.name} defaultValue={inputAnchor.key}></LabelComp>
                </Box>
            </>
        )}
        {inputParam &&
            <>
                <Box sx={{p: 2}}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <LabelComp name={inputParam.name} defaultValue={inputParam.key}></LabelComp>
                        <div style={{flexGrow: 1}}></div>

                    </div>

                    {<Input
                        disabled={disabled}
                        inputParam={inputParam}
                        onChange={(newValue) => (data.inputs[inputParam.key] = newValue)}
                        value={data.inputs[inputParam.key] ?? inputParam.default ?? ''}
                    />}
                </Box>
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