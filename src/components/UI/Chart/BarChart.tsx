import { memo, useEffect, useLayoutEffect, useRef } from "react";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Box, BoxProps, CircularProgress } from "@material-ui/core";
import { symbolFormatter } from "utils/textFormatter";
interface Props extends BoxProps {
  data: {
    [key: string]: string | number;
    category: string;
  }[];
  sort?: string;
  ord?: 1 | -1;
  id: string;
  label: {
    [key: string]: string;
  };
  tooltip: {
    [key: string]: string;
  };
}


export const BarChart: React.FC<Props> = memo<Props>(({ data, id, label, tooltip, sort, ord = 1, ...props }) => {

  const isMounted = useRef(false);
  const chartRef = useRef<am4charts.XYChart>();
  const dataRef = useRef(data);
  const idRef = useRef(id);
  const labelRef = useRef(label);
  const tooltipRef = useRef(tooltip);
  const sortRef = useRef(sort);
  const ordRef = useRef(ord);

  useLayoutEffect(() => {
    return () => {
      chartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (!chartRef.current) return;
      dataRef.current = data;
      chartRef.current.data = dataRef.current;
    }
  }, [data]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      chartRef.current = am4core.create(idRef.current, am4charts.XYChart);
      chartRef.current.numberFormatter.numberFormat = "#.###";
      chartRef.current.colors.step = 2;

      if (Object.keys(labelRef.current).length > 1) {
        chartRef.current.legend = new am4charts.Legend();
        chartRef.current.legend.position = 'top';
        chartRef.current.legend.paddingBottom = 20;
        chartRef.current.legend.labels.template.maxWidth = 95;
      }

      let xAxis = chartRef.current.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = 'category';
      xAxis.renderer.cellStartLocation = 0.05;
      xAxis.renderer.cellEndLocation = 0.95;
      xAxis.renderer.grid.template.location = 0;
      xAxis.renderer.minGridDistance = 0;
      xAxis.renderer.labels.template.horizontalCenter = 'right';
      xAxis.renderer.labels.template.verticalCenter = 'middle';
      xAxis.renderer.labels.template.rotation = 300;

      let yAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;
      yAxis.renderer.labels.template.adapter.add("textOutput", function (text, target) {
        return symbolFormatter(parseInt(text), 0);
      });

      const arrangeColumns = () => {
        if (!chartRef.current) return;
        let series: any = chartRef.current.series.getIndex(0);
        let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
          let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
          let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
          let delta = ((x1 - x0) / chartRef.current.series.length) * w;
          if (am4core.isNumber(delta)) {
            let middle = chartRef.current.series.length / 2;

            let newIndex = 0;
            chartRef.current.series.each(function (series) {
              if (!chartRef.current) return;
              if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
              }
              else {
                series.dummyData = chartRef.current.series.indexOf(series);
              }
            });
            let visibleCount = newIndex;
            let newMiddle = visibleCount / 2;

            chartRef.current.series.each(function (series) {
              if (!chartRef.current) return;
              let trueIndex = chartRef.current.series.indexOf(series);
              let newIndex = series.dummyData;

              let dx = (newIndex - trueIndex + middle - newMiddle) * delta;

              series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
              series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            });
          }
        }
      };

      const createSeries = (value: string, name: string) => {
        if (!chartRef.current) return;
        let series = chartRef.current.series.push(new am4charts.ColumnSeries());
        series.columns.template.tooltipText = tooltipRef.current[value];
        if (series.tooltip) {
          series.tooltip.autoTextColor = false;
          series.tooltip.label.fill = am4core.color("#FFFFFF");
        }
        series.dataFields.valueY = value;
        series.dataFields.categoryX = 'category';
        series.name = name;

        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);

        let bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.interactionsEnabled = false;
        bullet.dy = 15;
        bullet.label.text = '{valueY}';
        bullet.label.fill = am4core.color('#ffffff');


        return series;
      };

      chartRef.current.data = dataRef.current.sort((a, b) => !!sortRef.current ? ((a[sortRef.current] as number) - (b[sortRef.current] as number)) * ordRef.current : 0);

      for (let key of Object.keys(labelRef.current)) {
        createSeries(key, labelRef.current[key]);
      }
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (!data) {
    return <Box className='center-content' {...props}>
      <CircularProgress size={70} />
    </Box>;
  }

  return <Box id={id} {...props} />;
});
