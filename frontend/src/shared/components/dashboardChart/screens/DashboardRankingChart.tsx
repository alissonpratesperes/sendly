
import type { ECharts } from 'echarts';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

import * as S from '../styles/dashboardChart.style';

import { DashboardGraphicInfoProps } from '../interfaces/dashboardGraphicInfoProps.interface';

export const DashboardRankingChart = ({ counterData, graphicData, graphicConfig }: DashboardGraphicInfoProps) => {
    const [chartInstance, setChartInstance] = useState<ECharts | null>(null);

    const hasEntityWithMoreThanOneCounted = counterData > 1;

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
        series: [
            {
                type: "pie",
                radius: ["40%", "65%"],
                center: ["25%", "50%"],

                padAngle: 4,

                    itemStyle: {
                        borderRadius: 8
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
                                .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                                .map((item) => ({ name: item.name, value: item.value, })),
            },
        ],
    };

    useEffect(() => {
        if (!chartInstance || chartInstance.isDisposed()) {
            return;
        }

        let previousWidth = 0;
        let previousHeight = 0;

        const updateGraphic = () => {
            if (!chartInstance || chartInstance.isDisposed()) {
                return;
            }

            const width = chartInstance.getWidth();
            const height = chartInstance.getHeight();

            if (width === previousWidth && height === previousHeight) {
                return;
            }

            previousWidth = width;
            previousHeight = height;

            const centerX = width * 0.25;
            const centerY = height * 0.5;

            chartInstance.setOption({
                graphic: [
                    {
                        x: centerX,
                        type: "text",
                        y: centerY - 8,

                            style: {
                                fontSize: 32,
                                fontWeight: 700,
                                fill: "#171719",
                                textAlign: "center",
                                text: String(counterData),
                                textVerticalAlign: "middle",
                            },
                    },
                    {
                        type: "text",
                        x: centerX,
                        y: centerY + 20,

                            style: {
                                fontSize: 14,
                                fill: "#7A8497",
                                textAlign: "center",
                                textVerticalAlign: "middle",
                                text: hasEntityWithMoreThanOneCounted ? graphicConfig.entityPlural : graphicConfig.entitySingular,
                            },
                    },
                ],
            });
        };

        updateGraphic();

        const observer = new ResizeObserver(updateGraphic);

        observer.observe(chartInstance.getDom());

        return () => observer.disconnect();

    }, [ chartInstance, counterData, graphicConfig, hasEntityWithMoreThanOneCounted, ]);

    return (
        <S.DashboardChartContainer>
            <S.DashboardChartCard>
                <ReactECharts option={ option } notMerge={ false } onChartReady={ (instance) => setChartInstance(instance) }/>
            </S.DashboardChartCard>
        </S.DashboardChartContainer>
    );
}
