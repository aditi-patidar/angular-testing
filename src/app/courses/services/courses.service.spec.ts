import {TestBed} from '@angular/core/testing';
import {CoursesService} from './courses.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES} from '../../../../server/db-data';

let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

describe('CourseServicew', () => {
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
        expect(courses).toBeTruthy('No courses returned');

        expect(courses.length).toBe(12, 'incorrect number of courses');

        const course = courses.find(el => el.id === 12);

        expect(course.titles.description).toBe('Angular Testing Course');

        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        req.flush({payload: Object.values(COURSES)});

      });
  });

});
