import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
// As an alternative to rrule there is also rSchedule
// See https://github.com/mattlewis92/angular-calendar/issues/711#issuecomment-418537158 for more info
import RRule from 'rrule';
import moment from 'moment-timezone';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent
} from 'angular-calendar';
import { colors } from './colors';
import { ViewPeriod } from 'calendar-utils';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

// FIX
// Bruce Emerson (Birthday)
class Event {
  detail: string;
  type: string;
  date: string;
  constructor(detail: string, type: string, date: string) {
    this.detail = detail;
    this.type = type;
    this.date = date
  }
}

interface RecurringEvent extends CalendarEvent {
  title: string;
  color: any;
  date: Date;
  type: string;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
  };
}

// we set the timezone to UTC to avoid issues with DST changes
// see https://github.com/mattlewis92/angular-calendar/issues/717 for more info
moment.tz.setDefault('Utc');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  view = CalendarView.Month;

  viewDate = moment().toDate();
  printViewDate = new Date(`01-01-2018`);
  recurringEvents: RecurringEvent[] = [];

  ngOnInit(): void {
    let events = this.buildEvents();
    for (const event of events) {
      let calendarEvent = new Object as RecurringEvent;
      let date: Date = new Date(event.date);
      calendarEvent.title = event.detail;
      calendarEvent.color = colors.blue;
      calendarEvent.date = date;
      calendarEvent.type = event.type;
      calendarEvent.rrule = {
        freq: RRule.YEARLY,
        bymonth: date.getMonth() + 1,
        bymonthday: date.getDate() + 1,
      }
      this.recurringEvents.push(calendarEvent);
    }
    console.log('Recurring Events:', this.recurringEvents);

  }

  public printPdf() {
    const year = new Date().getFullYear();
    let month = 0;
    this.printViewDate = new Date(`${month}-01-${year}`);
    var data = document.getElementById('calendarView');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let doc = new jspdf('l', 'mm', 'letter'); // A4 size page of PDF
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      var position = 0;
      doc.addImage(contentDataURL, 'PNG', 0, position, 270, 210)
      doc.save('MYPdf.pdf'); // Generated PDF   
    });
  }

  calendarEvents: RecurringEvent[] = [];

  viewPeriod: ViewPeriod;

  showMenu() {

    console.log('hit');
  }

  buildEvents() {
    let events = new Array<Event>();
    events.push(new Event('Anselme LeCours', 'birth', '04 JAN 1904'));
    events.push(new Event('Violette LeCours', 'birth', '09 DEC 1908'));
    events.push(new Event('Mignonne LeBlanc', 'birth', '03 JUL 1929'));
    events.push(new Event('Vincent LeBlanc', 'birth', '03 SEP 1927'));
    events.push(new Event('Daniel LeBlanc', 'birth', '03 MAR 1956'));
    events.push(new Event('Nicole LeBlanc', 'birth', '23 FEB 1957'));
    events.push(new Event('Claire LeBlanc', 'birth', '02 OCT 1958'));
    events.push(new Event('Michele LeBlanc', 'birth', '22 AUG 1961'));
    events.push(new Event('Monique LeBlanc', 'birth', '21 DEC 1962'));
    events.push(new Event('Elisabeth LeBlanc', 'birth', '03 JUL 1965'));
    events.push(new Event('Claire Shea Kantany', 'birth', '19 NOV 2013'));
    events.push(new Event('Tiffani LeBlanc', 'birth', '26 JAN 1994'));
    events.push(new Event('Joseph LeBlanc', 'birth', '12 JUL 2003'));
    events.push(new Event('Charles Decker', 'birth', '17 APR 1952'));
    events.push(new Event('Matthew Decker', 'birth', '19 NOV 1982'));
    events.push(new Event('Michael Decker', 'birth', '19 OCT 1984'));
    events.push(new Event('Kenneth Decker', 'birth', '16 JUN 1986'));
    events.push(new Event('David Kapusta', 'birth', '18 NOV 1954'));
    events.push(new Event('John Kapusta', 'birth', '22 JAN 1987'));
    events.push(new Event('Thomas Kapusta', 'birth', '15 FEB 1990'));
    events.push(new Event('Genevieve Coup', 'birth', '24 APR 2012'));
    events.push(new Event('William Gunther', 'birth', '25 MAR 1989'));
    events.push(new Event('Stephen Gunther', 'birth', '29 APR 1992'));
    events.push(new Event('Daniel Gunther', 'birth', '02 DEC 1993'));
    events.push(new Event('Brian Gunther', 'birth', '03 SEP 1996'));
    events.push(new Event('Mark Miculcy', 'birth', '22 MAY 1958'));
    events.push(new Event('Kevin Miculcy', 'birth', '10 MAR 1986'));
    events.push(new Event('Kristin Miculcy', 'birth', '22 JUN 1987'));
    events.push(new Event('Konnor Miculcy', 'birth', '29 APR 1991'));
    events.push(new Event('Kyle Miculcy', 'birth', '09 FEB 1998'));
    events.push(new Event('Adam Emerson', 'birth', '26 FEB 1965'));
    events.push(new Event('Justin Emerson', 'birth', '05 JUN 1992'));
    events.push(new Event('Alexa Emerson', 'birth', '29 SEP 1994'));
    events.push(new Event('Hope Emerson', 'birth', '14 APR 1998'));
    events.push(new Event('Denis LeCours', 'birth', '03 SEP 1930'));
    events.push(new Event('Denise Lemay Hark', 'birth', '31 JUL 1937'));
    events.push(new Event('David LeCours', 'birth', '28 JUL 1961'));
    events.push(new Event('Patrick LeCours', 'birth', '08 JAN 1963'));
    events.push(new Event('Deborah LeCours', 'birth', '08 AUG 1964'));
    events.push(new Event('James LeCours', 'birth', '03 NOV 1965'));
    events.push(new Event('Steven LeCours', 'birth', '18 JAN 1968'));
    events.push(new Event('Suzanne Barrett', 'birth', '08 JUN 1965'));
    events.push(new Event('Bayley LeCours', 'birth', '30 MAR 1994'));
    events.push(new Event('Megan LeCours', 'birth', '21 FEB 1997'));
    events.push(new Event('Carter Tosch', 'birth', '27 JUL 2007'));
    events.push(new Event('Gregory Potter', 'birth', '24 FEB 1994'));
    events.push(new Event('Mark Potter', 'birth', '31 JAN 1998'));
    events.push(new Event('Sarah Potter', 'birth', '25 MAY 2001'));
    events.push(new Event('Beth Peters', 'birth', '04 JAN 1961'));
    events.push(new Event('Denis LeCours', 'birth', '23 JAN 1999'));
    events.push(new Event('Jay LeCours', 'birth', '25 DEC 2000'));
    events.push(new Event('Jason Coup', 'birth', '24 APR 2012'));
    events.push(new Event('Andrew LeCours', 'birth', '20 OCT 1995'));
    events.push(new Event('Henry LeCours', 'birth', '26 JAN 1999'));
    events.push(new Event('Robert LeCours', 'birth', '16 DEC 1931'));
    events.push(new Event('Lawrence LeCours', 'birth', '09 FEB 1935'));
    events.push(new Event('Roger LeCours', 'birth', '27 MAY 1936'));
    events.push(new Event('Leo LeCours', 'birth', '29 DEC 1937'));
    events.push(new Event('Annette LeCours', 'birth', '07 OCT 1940'));
    events.push(new Event('Jacqueline LeCours', 'birth', '15 AUG 1943'));
    events.push(new Event('Diane LeCours', 'birth', '26 AUG 1946'));
    events.push(new Event('Paulette LeCours', 'birth', '06 OCT 1947'));
    events.push(new Event('Dan LeCours', 'birth', '06 FEB 1953'));
    events.push(new Event('Michael LeCours', 'birth', '06 FEB 1953'));
    events.push(new Event('Bonnie Boulrisse', 'birth', '16 MAR 1945'));
    events.push(new Event('Tim LeCours', 'birth', '12 APR 1967'));
    events.push(new Event('Mary LeCours', 'birth', '18 FEB 1969'));
    events.push(new Event('Kathy LeCours', 'birth', '22 JUL 1970'));
    events.push(new Event('Michele LeCours', 'birth', '02 DEC 1972'));
    events.push(new Event('Chris Morrissey', 'birth', '16 JAN 1962'));
    events.push(new Event('Riley Morrissey', 'birth', '08 SEP 1997'));
    events.push(new Event('Allie Morrissey', 'birth', '24 NOV 1998'));
    events.push(new Event('Syd Banfield', 'birth', '01 NOV 1964'));
    events.push(new Event('Jeff Martel', 'birth', '24 JUN 1967'));
    events.push(new Event('Gail Jones', 'birth', '27 JAN 1955'));
    events.push(new Event('Julie Cole', 'birth', '27 MAY 1974'));
    events.push(new Event('Luke LeCours', 'birth', '24 AUG 1985'));
    events.push(new Event('Brandon Coburn', 'birth', '06 AUG 1994'));
    events.push(new Event('Tyler LeCours', 'birth', '19 MAR 1992'));
    events.push(new Event('Sam LeCours', 'birth', '23 MAR 1994'));
    events.push(new Event('Romain Dion', 'birth', '19 FEB 1930'));
    events.push(new Event('Lucille Mathieus', 'birth', '13 OCT 1930'));
    events.push(new Event('Denise Dion', 'birth', '01 JUN 1959'));
    events.push(new Event('Susan Dion', 'birth', '12 JUL 1960'));
    events.push(new Event('Michelle Dion', 'birth', '18 JUL 1968'));
    events.push(new Event("Keith O'Neil", 'birth', '21 MAY 1959'));
    events.push(new Event("Ian O'Neil", 'birth', '19 NOV 1992'));
    events.push(new Event("Aubrey O'Neil", 'birth', '25 DEC 1993'));
    events.push(new Event('Mark Kearney', 'birth', '19 APR 1961'));
    events.push(new Event('Colin Kearney', 'birth', '12 JAN 1986'));
    events.push(new Event('Lee Kearney', 'birth', '26 MAY 1988'));
    events.push(new Event('Logan Kearney', 'birth', '03 SEP 1991'));
    events.push(new Event('Bob Marchessault', 'birth', '08 JUL 1961'));
    events.push(new Event('Jacqueline Marchessault', 'birth', '27 SEP 1994'));
    events.push(new Event('Zachary LeCours', 'birth', '24 JUL 2006'));
    events.push(new Event('Scott LeCours', 'birth', '29 MAR 1970'));
    events.push(new Event('Amy LeCours', 'birth', '02 JUN 1974'));
    events.push(new Event('Andy Tosch', 'birth', '23 JUL 1970'));
    events.push(new Event('Sadie Tosch', 'birth', '07 MAR 2002'));
    events.push(new Event('Nita Boulrisse', 'birth', '13 MAR 1940'));
    events.push(new Event('Karen LeCours', 'birth', '04 JAN 1970'));
    events.push(new Event('Madison Martel', 'birth', '04 DEC 2007'));
    events.push(new Event('Michelle Yando', 'birth', '27 JUN 1996'));
    events.push(new Event('Joseph Yando', 'birth', '09 MAY 1999'));
    events.push(new Event('Amy Yando', 'birth', '30 MAY 2002'));
    events.push(new Event('Madeleine Ballargeon', 'birth', '22 AUG 1933'));
    events.push(new Event('Marc LeCours', 'birth', '27 MAY 1956'));
    events.push(new Event('Suzanne LeCours', 'birth', '10 DEC 1957'));
    events.push(new Event('Alan LeCours', 'birth', '18 NOV 1958'));
    events.push(new Event('Brian LeCours', 'birth', '10 FEB 1960'));
    events.push(new Event('John LeCours', 'birth', '21 APR 1961'));
    events.push(new Event('Thomas LeCours', 'birth', '05 SEP 1962'));
    events.push(new Event('Lisa LeCours', 'birth', '11 FEB 1967'));
    events.push(new Event('Mary Bell', 'birth', '23 FEB 1958'));
    events.push(new Event('Diane LeCours', 'birth', '08 OCT 1984'));
    events.push(new Event('Elise LeCours', 'birth', '16 SEP 1986'));
    events.push(new Event('Laura Yates', 'birth', '24 JUL 1959'));
    events.push(new Event('Daniel LeCours', 'birth', '07 MAR 1984'));
    events.push(new Event('Katherine LeCours', 'birth', '12 JUN 1987'));
    events.push(new Event('Colleen Curley', 'birth', '22 FEB 1961'));
    events.push(new Event('Catherine LeCours', 'birth', '22 FEB 2000'));
    events.push(new Event("Erin O'Neil", 'birth', '21 MAR 1961'));
    events.push(new Event('Eric LeCours', 'birth', '11 APR 1989'));
    events.push(new Event('Douglas LeCours', 'birth', '28 DEC 1992'));
    events.push(new Event('David Coup', 'birth', '16 APR 1965'));
    events.push(new Event('Nikki Nadeau', 'birth', '16 OCT 1978'));
    events.push(new Event('Noah LeCours', 'birth', '29 JUN 2004'));
    events.push(new Event('Pat Tucker', 'birth', '19 JUL 1941'));
    events.push(new Event('Jeffrey LeCours', 'birth', '28 JAN 1964'));
    events.push(new Event('Jennifer LeCours', 'birth', '21 SEP 1966'));
    events.push(new Event('Mamadou Drame', 'birth', '01 JUL 1983'));
    events.push(new Event('Christi LeCours', 'birth', '31 OCT 1986'));
    events.push(new Event('Lindsay LeCours', 'birth', '30 SEP 1989'));
    events.push(new Event('Hayley LeCours', 'birth', '29 AUG 1994'));
    events.push(new Event('Natalie Morrissey', 'birth', '22 DEC 2004'));
    events.push(new Event('Donald Miller', 'birth', '22 APR 1933'));
    events.push(new Event('Michael Miller', 'birth', '24 MAY 1963'));
    events.push(new Event('Stacey Miller', 'birth', '24 APR 1965'));
    events.push(new Event('Stefanie Miller', 'birth', '18 FEB 1970'));
    events.push(new Event('Daniel Miller', 'birth', '11 SEP 1974'));
    events.push(new Event('Rania Naccoches', 'birth', '15 APR 1974'));
    events.push(new Event('Robert Borges', 'birth', '12 OCT 1943'));
    events.push(new Event('Maria Borges', 'birth', '13 JAN 1969'));
    events.push(new Event('Julie Borges', 'birth', '12 MAR 1971'));
    events.push(new Event('Amanda Smith', 'birth', '12 AUG 1988'));
    events.push(new Event('Brittani Tharp', 'birth', '07 NOV 1991'));
    events.push(new Event('Blake Brooking', 'birth', '12 JUL 1997'));
    events.push(new Event('Morgan Brooking', 'birth', '22 JUL 1991'));
    events.push(new Event('Emile Fournier', 'birth', '29 SEP 1946'));
    events.push(new Event('Kevin Ingraham', 'birth', '15 AUG 1970'));
    events.push(new Event('Lori Ingraham', 'birth', '09 AUG 1971'));
    events.push(new Event('Brian Fournier', 'birth', '10 OCT 1984'));
    events.push(new Event('Eric Fournier', 'birth', '13 FEB 1992'));
    events.push(new Event('Mark Branda', 'birth', '20 FEB 1973'));
    events.push(new Event('Nate Branda', 'birth', '19 AUG 2004'));
    events.push(new Event('Richard Bessette', 'birth', '02 JUN 1948'));
    events.push(new Event('Jason Bessette', 'birth', '20 NOV 1971'));
    events.push(new Event('Matt Bessette', 'birth', '05 MAY 1976'));
    events.push(new Event('Rachel Bessette', 'birth', '10 SEP 1979'));
    events.push(new Event('Bruce Grandchamp', 'birth', '21 AUG'));
    events.push(new Event('Richard LeCours', 'birth', '22 NOV 1950'));
    events.push(new Event('Andrew Whitney', 'birth', '31 MAR 1991'));
    events.push(new Event('Timothy Whitney', 'birth', '29 SEP 1964'));
    events.push(new Event('Al Hark', 'birth', '07 JUL 1923'));
    events.push(new Event('Alyssa Whitney', 'birth', '14 JUN 1995'));
    events.push(new Event('Adam Whitney', 'birth', '25 JUN 1993'));
    events.push(new Event('Catrina Miller', 'birth', '09 OCT 2006'));
    events.push(new Event('Michael Monte', 'birth', '17 SEP 1967'));
    events.push(new Event('Michael Thorsted', 'birth', '21 MAY 1956'));
    events.push(new Event('Lauren Park', 'birth', '31 JUL 1984'));
    events.push(new Event('Nathaniel Coup', 'birth', '09 MAR 2008'));
    events.push(new Event('Brandon Miller', 'birth', '27 FEB 2008'));
    events.push(new Event('Nick LeBlanc', 'birth', '02 JUL 1989'));
    events.push(new Event('Lilyana LeBlanc', 'birth', '30 JAN 2010'));
    events.push(new Event('Olivia Martel', 'birth', '10 FEB 2010'));
    events.push(new Event('Katie Austin', 'birth', '14 AUG 1987'));
    events.push(new Event("Leslie O'Neil", 'birth', '17 JUN 1956'));
    events.push(new Event('Matt Fraijo', 'birth', '06 FEB 1986'));
    events.push(new Event('Jimmy Kantany', 'birth', '14 SEP 1984'));

    events.push(new Event('Kenley Joanne LeBlanc', 'birth', '31 OCT 2012'));
    events.push(new Event('Grant Thomas Fournier', 'birth', '28 NOV 2013'));
    events.push(new Event('Molly Allen Dimick', 'birth', '14 OCT 1961'));
    events.push(new Event('Maisie LeCours Brown', 'birth', '02 JUL 2014'));
    events.push(new Event('Stacey Hollenbach', 'birth', '10 APR 1986'));
    events.push(new Event('Lynn Nikell', 'birth', '27 AUG 1961'));
    events.push(new Event('Natalie Fraijo', 'birth', '11 DEC 2014'));
    events.push(new Event('Jack James Kantany', 'birth', '27 JUN 2015'));
    events.push(new Event('Maggie Stahlin', 'birth', '27 MAY 1988'));
    events.push(new Event('Anna Aschenbach', 'birth', '17 DEC 2015'));
    events.push(new Event('Jason Morris', 'birth', '23 JUN 1979'));
    events.push(new Event('Gordon Charles Decker', 'birth', '22 JUL 2016'));
    events.push(new Event('Mamadou Robert Drame', 'birth', '13 FEB 2016'));
    events.push(new Event('Matthew Fraijo', 'birth', '06 JUL 2017'));
    events.push(new Event('Brycen Andrew LeBlanc', 'birth', '07 NOV 2017'));
    events.push(new Event('Mariah-Jeanne Lanctot', 'birth', '29 SEP 1990'));
    events.push(new Event('Jameson Richard Whitney', 'birth', '13 OCT 2017'));
    events.push(new Event('Simon Junliang Kapusta', 'birth', '02 MAR 2017'));
    events.push(new Event('Violette LeCours Morris', 'birth', '07 AUG 2017'));
    events.push(new Event('Anselme & Violet LeCours', 'anniversary', '27 AUG 1928'));
    events.push(new Event('Mignonne & Vincent LeBlanc', 'anniversary', '21 MAY 1955'));
    events.push(new Event('Nicki & Chas Decker', 'anniversary', '04 AUG 1979'));
    events.push(new Event('Claire & David Kapusta', 'anniversary', '30 JUL 1983'));
    events.push(new Event('Michele LeBlanc & Leon Chetuk', 'anniversary', '19 JUL 2014'));
    events.push(new Event('Monique & Mark Miculcy', 'anniversary', '26 NOV 1983'));
    events.push(new Event('Beth & Adam Emerson', 'anniversary', '20 MAY 1990'));
    events.push(new Event('Kristin & Jimmy Kantany', 'anniversary', '28 APR 2012'));
    events.push(new Event('Kenny & Stacey Decker', 'anniversary', '28 SEP 2013'));
    events.push(new Event('John & Katie Kapusta', 'anniversary', '11 JUN 2011'));
    events.push(new Event('Lisa LeCours & David Coup', 'anniversary', '01 JUN 2001'));
    events.push(new Event('Will & Maggie Gunther', 'anniversary', '19 DEC 2015'));
    events.push(new Event('& Konnor Miculcy', 'anniversary', '15 JUL 2017'));
    events.push(new Event('David & Suzanne LeCours', 'anniversary', '30 JUL 1988'));
    events.push(new Event('Debbie & Joe Miller', 'anniversary', '28 JUN 2009'));
    events.push(new Event('Jim & Beth LeCours', 'anniversary', '20 MAR 1999'));
    events.push(new Event('Amy & Andy Tosch', 'anniversary', '19 AUG 2000'));
    events.push(new Event('Robert & Madeleine LeCours', 'anniversary', '16 APR 1955'));
    events.push(new Event('Lawrence & Nita LeCours', 'anniversary', '19 JUN 1965'));
    events.push(new Event('Roger & Pat LeCours', 'anniversary', '29 DEC 1962'));
    events.push(new Event('Leo & Bonnie LeCours', 'anniversary', '09 JUL 1966'));
    events.push(new Event('Annette & Don Miller', 'anniversary', '07 JUL 1962'));
    events.push(new Event('Jacquie & Bob Borges', 'anniversary', '24 JUN 1967'));
    events.push(new Event('Diane & Emile Fournier', 'anniversary', '18 JUN 1983'));
    events.push(new Event('Paulette & Richard Bessette', 'anniversary', '03 APR 1971'));
    events.push(new Event('Dan & Gail LeCours', 'anniversary', '10 OCT 1981'));
    events.push(new Event('Mary & Chris Morrissey', 'anniversary', '03 JUL 1993'));
    events.push(new Event('Kathy & Syd Bandfield', 'anniversary', '03 JUL 1999'));
    events.push(new Event('Michele & Jeff Martel', 'anniversary', '15 JUL 2000'));
    events.push(new Event('Julie & Bruce Grandchamp', 'anniversary', '31 DEC 2004'));
    events.push(new Event('Lucille & Romain Dion', 'anniversary', '29 NOV 1958'));
    events.push(new Event('Denise & Mark Kearney', 'anniversary', '28 AUG 1982'));
    events.push(new Event('Susan & Bob Marchessault', 'anniversary', '23 JUL 1988'));
    events.push(new Event("Michelle & Keith O'Neil", 'anniversary', '09 NOV 1991'));
    events.push(new Event('Scott & Nikki LeCours', 'anniversary', '03 AUG 2002'));
    events.push(new Event('Karen LeCours & Bruce Emerson', 'anniversary', '10 JUL 2007'));
    events.push(new Event('Marc & Mary LeCours', 'anniversary', '03 DEC 1981'));
    events.push(new Event('Alan & Laura LeCours', 'anniversary', '28 DEC 1981'));
    events.push(new Event('Brian & Coleen LeCours', 'anniversary', '15 AUG 1981'));
    events.push(new Event('John & Erin LeCours', 'anniversary', '10 OCT 1987'));
    events.push(new Event('Tom & Lynn LeCours', 'anniversary', '19 JUL 2015'));
    events.push(new Event('Elise & Matt Fraijo', 'anniversary', '23 JUN 2012'));
    events.push(new Event('Daniel & Amanda LeCours', 'anniversary', '15 MAY 2010'));
    events.push(new Event('Katherine and Mamadou Drame', 'anniversary', '27 JUN 2009'));
    events.push(new Event('Jeff & Molly LeCours', 'anniversary', '16 OCT 2013'));
    events.push(new Event('Jennifer and Timothy Whitney', 'anniversary', '24 SEP 1988'));
    events.push(new Event('Nick & Lindsay LeBlanc', 'anniversary', '30 MAY 2009'));
    events.push(new Event('Stacey & Mike Thorsted', 'anniversary', '29 DEC 2006'));
    events.push(new Event('Stefanie & Michael Monte', 'anniversary', '23 SEP 2006'));
    events.push(new Event('Dan & Rania Miller', 'anniversary', '01 OCT 2005'));
    events.push(new Event('Lori & Mark Branda', 'anniversary', '11 MAY 2002'));
    events.push(new Event('Brian & Lauren Fournier', 'anniversary', '05 APR 2008'));
    events.push(new Event('Rachel & Jason Morris', 'anniversary', '19 SEP 2015'));
    events.push(new Event('Andrew & Mariah-Jeanne Whitney', 'anniversary', '27 OCT 2017'));
    return events;
  }

  constructor(private cdr: ChangeDetectorRef) { }

  getYearsSince(event) {
    let eventYear: number = event.date.getUTCFullYear();
    let now: Date = new Date();
    let currentYear = now.getUTCFullYear();
    return currentYear - eventYear;
  }

  updateCalendarEvents(
    viewRender:
      | CalendarMonthViewBeforeRenderEvent
      | CalendarWeekViewBeforeRenderEvent
      | CalendarDayViewBeforeRenderEvent
  ): void {
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;
      this.calendarEvents = Array<RecurringEvent>();

      this.recurringEvents.forEach(event => {
        const rule: RRule = new RRule({
          ...event.rrule,
          dtstart: moment(viewRender.period.start)
            .startOf('day')
            .toDate(),
          until: moment(viewRender.period.end)
            .endOf('day')
            .toDate()
        });
        const { title, color } = event;

        rule.all().forEach(date => {
          this.calendarEvents.push({
            title,
            color,
            type: event.type,
            date: event.date,
            start: moment(date).toDate(),
          });
        });
      });
      this.cdr.detectChanges();
    }
  }
}
