import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from "@angular/core";
import { TeacherProjectLibraryComponent } from './teacher-project-library.component';
import { LibraryGroup } from "../libraryGroup";
import { LibraryProject } from "../libraryProject";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { OfficialLibraryComponent } from "../official-library/official-library.component";
import { SharedModule } from "../../shared/shared.module";
import {
  MatBadgeModule,
  MatExpansionModule,
  MatIconModule,
  MatTabsModule
} from "@angular/material";
import { LibraryService } from "../../../services/library.service";
import { ProjectFilterOptions } from "../../../domain/projectFilterOptions";
import { fakeAsyncResponse } from "../../../student/student-run-list/student-run-list.component.spec";
import { Observable } from "rxjs";

@Component({selector: 'app-library-group-thumbs', template: ''})
class LibraryGroupThumbsStubComponent {
  @Input()
  group: LibraryGroup = new LibraryGroup();
}

@Component({selector: 'app-library-project', template: ''})
class LibraryProjectStubComponent {
  @Input()
  project: LibraryProject = new LibraryProject();
}

@Component({selector: 'app-library-filters', template: ''})
class LibraryFiltersComponent {
  @Input()
  projects: LibraryProject[] = [];
}

describe('TeacherProjectLibraryComponent', () => {
  let component: TeacherProjectLibraryComponent;
  let fixture: ComponentFixture<TeacherProjectLibraryComponent>;
  const libraryServiceStub = {
    getLibraryGroups(): Observable<LibraryGroup[]> {
      const libraryGroup: LibraryGroup[] = [];
      return Observable.create( observer => {
        observer.next(libraryGroup);
        observer.complete();
      });
    },
    filterOptions(projectFilterOptions: ProjectFilterOptions): Observable<ProjectFilterOptions> {
      return Observable.create(observer => {
        observer.next(projectFilterOptions);
        observer.complete();
      });
    },
    projectFilterOptionsSource$: fakeAsyncResponse({
      searchValue: "",
      disciplineValue: [],
      dciArrangementValue: [],
      peValue: []
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        MatIconModule,
        MatBadgeModule,
        MatExpansionModule,
        MatTabsModule
      ],
      declarations: [
        OfficialLibraryComponent,
        TeacherProjectLibraryComponent,
        LibraryGroupThumbsStubComponent,
        LibraryProjectStubComponent,
        LibraryFiltersComponent
      ],
      providers: [
        { provide: LibraryService, useValue: libraryServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherProjectLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
