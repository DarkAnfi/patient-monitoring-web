import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Box, BoxProps, CircularProgress } from "@material-ui/core";
import { symbolFormatter } from "utils/textFormatter";

export interface DateLineChartRef {
  addData: (rawDataItem: Object | Object[], removeCount?: number | undefined) => void;
}

interface Props extends BoxProps {
  data: {
    [key: string]: any;
    date: Date;
    value: number;
  }[];
  id: string;
  label?: string;
  tooltip?: string;
  scrollable?: boolean;
}


export const DateLineChart = forwardRef<DateLineChartRef, Props>(({ data, id, label = '', tooltip = '{valueY}', scrollable = false, ...props }, ref) => {

  const isMounted = useRef(false);
  const chartRef = useRef<am4charts.XYChart>();
  const dataRef = useRef(data);
  const idRef = useRef(id);
  const labelRef = useRef(label);
  const tooltipRef = useRef(tooltip);
  const scrollableRef = useRef(scrollable);

  useImperativeHandle(ref, () => {
    return {
      addData: (rawDataItem, removeCount) => {
        if (!chartRef.current) return;
        chartRef.current.addData(rawDataItem, removeCount);
      }
    };
  }, []);

  useLayoutEffect(() => {
    return () => {
      chartRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (!chartRef.current) return;
      dataRef.current = data;
      chartRef.current.data = dataRef.current.map((item) => ({ ...item, date: typeof item.date === 'string' ? new Date(item.date) : item.date }));
    }
  }, [data]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      chartRef.current = am4core.create(idRef.current, am4charts.XYChart);
      chartRef.current.numberFormatter.numberFormat = "#.###,00";
      let dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
      dateAxis.baseInterval = {
        "timeUnit": "second",
        "count": 1
      };
      dateAxis.tooltipDateFormat = "yyyy/MM/dd HH:mm";


      let valueAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      if (valueAxis.tooltip) {
        valueAxis.tooltip.disabled = true;
      }
      valueAxis.title.text = labelRef.current;
      valueAxis.renderer.labels.template.adapter.add("textOutput", function (text, target) {
        return symbolFormatter(parseInt(text), 0);
      });


      let series = chartRef.current.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = tooltipRef.current;
      const color = series.fill as am4core.Color;
      series.fillOpacity = 0.3;
      let gradient = new am4core.LinearGradient();
      gradient.rotation = 90;
      gradient.addColor(color, 1, 0);
      gradient.addColor(color, 0, 0.5);
      series.fill = gradient;
      if (series.tooltip) {
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = color;
      }
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.lineY.opacity = 0;
      if (scrollableRef.current) chartRef.current.scrollbarX = new am4core.Scrollbar();

      dateAxis.start = 0;
      dateAxis.keepSelection = true;

      chartRef.current.data = dataRef.current.map((item) => ({ ...item, date: typeof item.date === 'string' ? new Date(item.date) : item.date }));
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

  return (
    <Box id={id} {...props} />
  );
});
