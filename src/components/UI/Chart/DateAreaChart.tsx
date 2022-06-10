import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Box, BoxProps, CircularProgress } from "@material-ui/core";
import { symbolFormatter } from "utils/textFormatter";

export interface DateAreaChartSerie {
  label: string;
  tooltipTemplate: string;
  valueYField: string;
};

export interface DateAreaChartItem {
  date: Date;
  [key: string]: any;
};

export interface DateAreaChartRef {
  addData: (rawDataItem: Object | Object[], removeCount?: number | undefined) => void;
}

interface Props extends BoxProps {
  dataSeries: DateAreaChartSerie[];
  data: DateAreaChartItem[];
  id: string;
  label?: string;
  scrollable?: boolean;
}


export const DateAreaChart = forwardRef<DateAreaChartRef, Props>(({ data, dataSeries, id, label = '', scrollable = false, ...props }, ref) => {

  const isMounted = useRef(false);
  const chartRef = useRef<am4charts.XYChart>();
  const dataRef = useRef(data);
  const dataSeriesRef = useRef(dataSeries);
  const idRef = useRef(id);
  const labelRef = useRef(label);
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
      dataSeriesRef.current = dataSeries;
      chartRef.current.series.clear();
      if (scrollableRef.current) chartRef.current.scrollbarX = new am4charts.XYChartScrollbar();
      dataSeriesRef.current.forEach(({ label, tooltipTemplate, valueYField }: DateAreaChartSerie) => {
        if (!chartRef.current) return;
        let series = chartRef.current.series.push(new am4charts.LineSeries());
        series.name = label;
        series.dataFields.valueY = valueYField;
        series.dataFields.dateX = "date";
        series.tooltipText = tooltipTemplate;
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
        if (scrollableRef.current) (chartRef.current.scrollbarX as am4charts.XYChartScrollbar).series.push(series);
      });
    }
  }, [dataSeries]);

  useEffect(() => {
    if (isMounted.current) {
      if (!chartRef.current) return;
      dataRef.current = data;
      chartRef.current.data = dataRef.current.map((item) => ({ ...item, date: typeof item.date === 'string' ? new Date(item.date) : item.date }))
      chartRef.current.data.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
  }, [data]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      chartRef.current = am4core.create(idRef.current, am4charts.XYChart);
      chartRef.current.numberFormatter.numberFormat = "#.###,00";
      chartRef.current.colors.step = 2;

      let dateAxis = chartRef.current.xAxes.push(new am4charts.DateAxis());
      dateAxis.baseInterval = {
        "timeUnit": "minute",
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
      if (scrollableRef.current) chartRef.current.scrollbarX = new am4charts.XYChartScrollbar();

      dataSeriesRef.current.forEach(({ label, tooltipTemplate, valueYField }: DateAreaChartSerie) => {
        if (!chartRef.current) return;
        let series = chartRef.current.series.push(new am4charts.LineSeries());
        series.name = label;
        series.dataFields.valueY = valueYField;
        series.dataFields.dateX = "date";
        series.tooltipText = tooltipTemplate;
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
        if (scrollableRef.current) (chartRef.current.scrollbarX as am4charts.XYChartScrollbar).series.push(series);
      });

      chartRef.current.legend = new am4charts.Legend();
      chartRef.current.legend.useDefaultMarker = true;
      chartRef.current.cursor = new am4charts.XYCursor();
      chartRef.current.cursor.lineY.opacity = 0;


      dateAxis.start = 0;
      dateAxis.keepSelection = true;

      chartRef.current.data = dataRef.current.map((item) => ({ ...item, date: typeof item.date === 'string' ? new Date(item.date) : item.date })).sort((a, b) => a.date.getTime() - b.date.getTime());
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
