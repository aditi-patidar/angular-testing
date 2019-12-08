import {TestBed} from '@angular/core/testing';
import {CoursesService} from './courses.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES} from '../../../../server/db-data';
import {Course} from '../model/course';
import {error} from 'util';
import {HttpErrorResponse} from '@angular/common/http';

let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

describe('CourseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses()
      .subscribe(courses => {
        // Check for the null or undefined
        // expect(courses).toBeTruthy('No courses returned');

        expect(courses.length).toBe(12, 'incorrect number of courses');

        const course = courses.find(el => el.id === 12);

        expect(course.titles.description).toBe('Angular Testing Course');

        // setup for mock http request object
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        // way to get data from mock api
        req.flush({payload: Object.values(COURSES)});

      });
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12)
      .subscribe(courses => {
        // Check for the null or undefined
        coursesService.findCourseById(12)
          .subscribe(course => {
            // expect(course).toBeTruthy();
            expect(course.id).toBe(12);
          });

        // setup for mock http request object
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        // way to get data from mock api
        req.flush(COURSES[12]);

      });
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course[12].id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({
      ...COURSES,
      ...changes
    });

  });

  it('should give an error when save course fails', () => {
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  /*afterEach(() => {
    httpTestingController.verify();
  });*/
});
