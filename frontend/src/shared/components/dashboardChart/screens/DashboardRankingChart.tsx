
import ReactECharts from 'echarts-for-react';

import * as S from '../styles/dashboardChart.style';

import { DashboardGraphicInfoProps } from '../interfaces/dashboardGraphicInfoProps.interface';

export const DashboardRankingChart = ({ counterData, graphicData, graphicConfig }: DashboardGraphicInfoProps) => {
    const hasEntityWithMoreThanOneCounted = counterData > 1;
const testGraphicData = [
    ...graphicData,
    ...graphicData,
    ...graphicData,
];
    const option = {
        legend: {
            left: "60%",
            top: "center",
            width: "35%",
            show: true,
            itemGap: 20,
            itemWidth: 12,
            itemHeight: 12,
            icon: "circle",
            orient: "vertical",

                textStyle: {
                    fontSize: 14,
                    color: "#7A8497",
                },
        },
        tooltip: {
            padding: [15],
            trigger: "item",
            backgroundColor: "#FFFFFF",
            borderColor: "transparent",
            borderWidth: 0,
            extraCssText: `
                border-radius: 14px;
                box-shadow: none;
            `,

                textStyle: {
                    fontSize: 14,
                    color: "#34415C",
                },

                    formatter: (params: any) => {
                        return `
                            <div style="min-width: 160px;">
                                <div style=" margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #223463;">
                                    ${ params.name }
                                </div>
                                <div style="display: flex; justify-content: space-between; gap: 16px;">
                                    <span style="color: #7A8497;"> ${ graphicConfig.subEntityPlural } </span>

                                    <strong style="color: #171719;"> ${ params.value } </strong>
                                </div>
                                <div style="margin-top: 5px; display: flex; justify-content: space-between;">
                                    <span style="color: #7A8497;"> Participação </span>

                                    <strong style="color: #171719;"> ${ params.percent }% </strong>
                                </div>
                            </div>
                        `;
                    },
        },
        graphic: [
            {
                left: "22.5%",
                top: "center",
                type: "group",

                    children: [
                        {
                            x: 0,
                            y: -18,
                            type: "text",

                                style: {
                                    width: 100,
                                    fontSize: 32,
                                    fontWeight: 700,
                                    fill: "#171719",
                                    textAlign: "center",

                                    text: String(counterData),
                                },
                        },
                        {
                            x: 0,
                            y: 20,
                            type: "text",

                                style: {
                                    width: 100,
                                    fontSize: 14,
                                    fontWeight: 400,
                                    fill: "#7A8497",
                                    textAlign: "center",

                                    text: `${ hasEntityWithMoreThanOneCounted ? graphicConfig.entityPlural : graphicConfig.entitySingular }`,
                                },
                        },
                    ],
            },
        ],
        series: [
            {
                type: "pie",
                radius: ["40%", "65%"],
                center: ["25%", "50%"],

                padAngle: hasEntityWithMoreThanOneCounted ? 4 : 0,

                    itemStyle: {
                        borderRadius: hasEntityWithMoreThanOneCounted ? 8 : 0,
                    },

                    labelLayout: {
                        hideOverlap: true,
                    },
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false,
                    },

                        emphasis: {
                            scale: true,
                            scaleSize: 10,

                                itemStyle: {
                                    shadowBlur: 0,
                                    shadowColor: "transparent",
                                },
                        },

                            data: [...graphicData]
                                .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
                                .map((item) => ({ name: item.name, value: item.value, })),
            },
        ],
    };

    return (
        <S.DashboardChartContainer>
            <S.DashboardChartCard>
                <ReactECharts option={ option } notMerge={ true }/>
            </S.DashboardChartCard>
        </S.DashboardChartContainer>
    );
}
