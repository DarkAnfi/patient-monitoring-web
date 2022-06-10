export const gaussianSort = (arr: number[] | Dict[], field?: string) => {
    if (!arr.length) throw new Error('The array in first parameter must not be empty');
    if (!arr.length || (typeof arr[0] !== 'number' && !field)) throw new Error('The first parameter is an array of objects, therefore you need to specify a second parameter to specify by which field the sort will be performed');
    if (typeof arr[0] !== 'number' && !!field && typeof arr[0][field] !== 'number') throw new Error('The specified field must be numeric');
    const sortedArray = [...arr].sort((a, b) => typeof arr[0] !== 'number' && !!field ? (a as Dict)[field] - (b as Dict)[field] : (a as number) - (b as number) );
    var gaussianArr: any[] = [];
    sortedArray.forEach((e, i) => (i % 2) ? gaussianArr.push(e) : gaussianArr.unshift(e));
    return gaussianArr;
};