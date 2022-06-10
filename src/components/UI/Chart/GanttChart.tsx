import { Color } from "@amcharts/amcharts4/core";
import { memo, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Box, BoxProps, CircularProgress } from "@material-ui/core";
import moment from "moment";
import { AxisRendererX, AxisRendererY, CategoryAxis, ColumnSeries, DateAxis } from "@amcharts/amcharts4/charts";

const colorSet = new am4core.ColorSet();

export interface GanttItem {
  [key: string]: any;
  id: string;
  fromDate: string;
  toDate: string;
  toDateLabel: string;
  selected: boolean;
  color?: Color | undefined;
}

interface GanttChartProps extends BoxProps {
  id: string;
  data: GanttItem[];
  color?: am4core.Color;
  fieldItemId: string;
  category: string;
  dateFormat?: string;
  minDate?: string;
  maxDate?: string;
  tooltipTemplate?: string;
  rowHeight?: number;
  onClick?: (item: Dict) => void;
  scrollable?: boolean;
}


export const GanttChartChart = memo<GanttChartProps>(({
  id,
  data,
  category,
  dateFormat = 'yyyy-MM-dd HH:mm',
  fieldItemId,
  minDate,
  maxDate,
  color = colorSet.baseColor,
  tooltipTemplate,
  rowHeight,
  onClick,
  scrollable = true,
  ...props
}) => {

  const isMounted = useRef(false);
  const chartRef = useRef<am4charts.XYChart>();
  const categoryAxisRef = useRef<CategoryAxis<AxisRendererY> | null>(null);
  const dateAxisRef = useRef<DateAxis<AxisRendererX> | null>(null);
  const seriesRef = useRef<ColumnSeries | null>(null);
  const dataRef = useRef(data);
  const idRef = useRef(id);
  // const labelRef = useRef(label);
  // const tooltipRef = useRef(tooltip);
  const scrollableRef = useRef(scrollable);

  const setSize = useCallback((ev: {
    type: "datavalidated";
    target: am4charts.XYChart;
  }) => {
    let chart = ev.target;
    let categoryAxis = chart.yAxes.getIndex(0);
    const items: string[] = [];
    dataRef.current.forEach((item) => {
      if (!items.includes(item[fieldItemId])) items.push(item[fieldItemId]);
    });
    if (categoryAxis) {
      let adjustHeight = items.length * (rowHeight ?? 40) - (categoryAxis as am4charts.Axis<am4charts.AxisRendererY>).pixelHeight;
      let targetHeight = chart.pixelHeight + adjustHeight;
      if (chart.svgContainer) chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    }
  }, [fieldItemId, rowHeight]);

  const hableEventClick = useCallback((ev) => {
    if (!!onClick) {
      onClick(ev.target.dataItem?.dataContext as Dict);
    }
  }, [onClick]);

  useLayoutEffect(() => {
    return () => {
      if (!!onClick && !!seriesRef.current) {
        seriesRef.current.columns.template.events.off("hit", hableEventClick, this);
      }
      chartRef.current?.events.off("datavalidated", setSize);
      chartRef.current?.dispose();
    };
  }, [setSize, onClick, hableEventClick]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      chartRef.current = am4core.create(idRef.current, am4charts.XYChart);
      chartRef.current.hiddenState.properties.opacity = 0;
      chartRef.current.paddingRight = 30;
      chartRef.current.dateFormatter.inputDateFormat = dateFormat;
      chartRef.current.data = dataRef.current.map((item) => ({
        ...item,
        color: !!item.color ? !!item.selected ? item.color : item.color.lighten(-0.5) : !!item.selected ? color : color.lighten(-0.5),
      }));
      // chartRef.current.numberFormatter.numberFormat = "#.###,00";

      categoryAxisRef.current = chartRef.current.yAxes.push(new am4charts.CategoryAxis());
      categoryAxisRef.current.dataFields.category = category;
      categoryAxisRef.current.renderer.grid.template.location = 0;
      categoryAxisRef.current.renderer.inversed = true;
      // if (isDarkActive) categoryAxis.renderer.labels.template.fill = am4core.color("white");

      dateAxisRef.current = chartRef.current.xAxes.push(new am4charts.DateAxis());
      dateAxisRef.current.dateFormatter.dateFormat = dateFormat;
      dateAxisRef.current.renderer.minGridDistance = 70;
      dateAxisRef.current.baseInterval = { count: 1, timeUnit: "minute" };
      if (!!minDate) dateAxisRef.current.min = new Date(minDate).getTime();
      if (!!maxDate) dateAxisRef.current.max = moment(new Date(`${maxDate} 23:59`)).format('yyyy/MM/DD') !== moment(new Date()).format('yyyy/MM/DD') ? new Date(moment(new Date(`${maxDate} 23:59`)).format('yyyy/MM/DD HH:mm')).getTime() : new Date(moment(new Date()).format('yyyy/MM/DD HH:mm')).getTime();
      dateAxisRef.current.strictMinMax = true;
      dateAxisRef.current.renderer.tooltipLocation = 0;
      // if (isDarkActive) dateAxis.renderer.labels.template.fill = am4core.color("white");

      seriesRef.current = chartRef.current.series.push(new am4charts.ColumnSeries());
      seriesRef.current.columns.template.height = 20;
      seriesRef.current.dataFields.openDateX = "fromDate";
      seriesRef.current.dataFields.dateX = "toDate";
      seriesRef.current.dataFields.categoryY = category;
      if (!!tooltipTemplate) seriesRef.current.columns.template.tooltipText = tooltipTemplate;
      seriesRef.current.columns.template.propertyFields.fill = 'color';
      seriesRef.current.columns.template.propertyFields.stroke = 'color';
      seriesRef.current.columns.template.strokeOpacity = 1;
      if (!!onClick) {
        seriesRef.current.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        seriesRef.current.columns.template.events.on("hit", hableEventClick, this);
      }
      if (seriesRef.current.columns.template.parent) seriesRef.current.columns.template.parent.height = 20;
      chartRef.current.events.on("datavalidated", setSize);

      if (scrollableRef.current) chartRef.current.scrollbarX = new am4core.Scrollbar();
    }
    return () => {
      isMounted.current = false;
    };
  }, [category, dateFormat, maxDate, minDate, setSize, tooltipTemplate, hableEventClick, onClick, color]);

  useEffect(() => {
    if (isMounted.current) {
      if (!chartRef.current) return;
      dataRef.current = data;
      chartRef.current.data = dataRef.current.map((item) => ({
        ...item,
        color: !!item.color ? !!item.selected ? item.color : item.color.lighten(-0.5) : !!item.selected ? color : color.lighten(-0.5),
      }));
    }
  }, [data, color]);

  if (!data) {
    return <Box className='center-content' {...props}>
      <CircularProgress size={70} />
    </Box>;
  }

  return <Box id={id} {...props} />;
});
