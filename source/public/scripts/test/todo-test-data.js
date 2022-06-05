/* eslint-disable import/named */

import { Note } from '../service/todo-note-item.js';

const milliSecsPerDay = 1000*60*60*24;

// eslint-disable-next-line import/prefer-default-export
export const testNotes = [
    new Note(
        0,
        "Pendenz 1",
        new Date("2022-04-22").getTime(),
        new Date().getTime(),
        true,
        1,
        "description 1"),
    new Note(
        0,
        "Pendenz 2",
        new Date("2022-04-23").getTime(),
        (new Date().getTime()) + milliSecsPerDay,
        false,
        2,
        "description 2"),
    new Note(
        0,
        "Pendenz 3",
        new Date("2022-04-24").getTime(),
        (new Date().getTime()) - milliSecsPerDay,
        true,
        3,
        "description 3"),
    new Note(
        0,
        "Pendenz 4",
        new Date("2022-04-25").getTime(),
        (new Date().getTime()) + 2*milliSecsPerDay,
        false,
        4,
        "description 4 xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx"),
    new Note(
        0,
        "Pendenz 5",
        new Date("2022-04-26").getTime(),
        (new Date().getTime()) - 2*milliSecsPerDay,
        false,
        5,
        "description 5"),
]
