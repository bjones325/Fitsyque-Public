import React from 'react'
import { PieChart } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'

class PieGraph extends React.PureComponent {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <PieChart
                style={{ height: 200 }}
                valueAccessor={({ item }) => item.amount}
                data={this.props.data}
                spacing={0}
                outerRadius={'95%'}
                renderDecorator={({ item, pieCentroid, index }) => (
                    <Text
                        key={index}
                        x={pieCentroid[ 0 ]}
                        y={pieCentroid[ 1 ]}
                        fill={'white'}
                        textAnchor={'middle'}
                        alignmentBaseline={'middle'}
                        fontSize={24}
                        stroke={'black'}
                        strokeWidth={0.2}
                    >
                        {item.percent}
                    </Text>
                )}

            />
        )
    }
}

export default PieGraph