import { styled } from 'styled-components';

export const DashboardChartContainer = styled.div`
    margin: 30px 0px 0px 0px;
    height: 350px;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    box-sizing: border-box;
    min-width: 0;
`;

export const DashboardChartCard = styled.div`
    height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex: 7;
    box-sizing: border-box;
    overflow: hidden;

        .echarts-for-react {
            height: 100%;
            min-height: 0;
            width: 100%;
            flex: 1;
        }

            canvas {
                max-width: 100%;
            }
`;
