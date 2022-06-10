
export const getDayNameByNumber = (indexDay: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[indexDay - 1];
};

