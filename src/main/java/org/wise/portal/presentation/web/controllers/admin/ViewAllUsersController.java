/**
 * Copyright (c) 2007-2018 Regents of the University of California (Regents).
 * Created by WISE, Graduate School of Education, University of California, Berkeley.
 *
 * This software is distributed under the GNU General Public License, v3,
 * or (at your option) any later version.
 *
 * Permission is hereby granted, without written agreement and without license
 * or royalty fees, to use, copy, modify, and distribute this software and its
 * documentation for any purpose, provided that the above copyright notice and
 * the following two paragraphs appear in all copies of this software.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE. THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
 * HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
 * SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
 * ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.wise.portal.presentation.web.controllers.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.wise.portal.domain.admin.DailyAdminJob;
import org.wise.portal.domain.authentication.impl.StudentUserDetails;
import org.wise.portal.domain.authentication.impl.TeacherUserDetails;
import org.wise.portal.domain.user.User;
import org.wise.portal.service.authentication.UserDetailsService;
import org.wise.portal.service.session.SessionService;
import org.wise.portal.service.user.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * @author Sally Ahn
 */
@Controller
@RequestMapping("/admin/account/manageusers")
public class ViewAllUsersController{

  @Autowired
  private UserService userService;

  @Autowired
  private UserDetailsService userDetailsService;

  @Autowired
  private SessionService sessionService;

  @Autowired
  private DailyAdminJob adminJob;

  protected static final String TEACHERS = "teachers";

  protected static final String STUDENTS = "students";

  protected static final String STUDENT = "student";

  protected static final String TEACHER = "teacher";

  protected static final String OTHER = "other";

  protected static final String USER_TYPE = "userType";

  private static final String USERNAMES = "usernames";

  private static final String LOGGED_IN_STUDENT_USERNAMES = "loggedInStudentUsernames";

  private static final String LOGGED_IN_TEACHER_USERNAMES = "loggedInTeacherUsernames";

  @RequestMapping(method = RequestMethod.GET)
  @SuppressWarnings("unchecked")
  protected String showUsers(HttpServletRequest request, ModelMap modelMap) throws Exception {
    String onlyShowLoggedInUser = request.getParameter("onlyShowLoggedInUser");
    String onlyShowUsersWhoLoggedIn = request.getParameter("onlyShowUsersWhoLoggedIn");
    if (onlyShowLoggedInUser != null && onlyShowLoggedInUser.equals("true")) {
      modelMap.put(LOGGED_IN_STUDENT_USERNAMES, sessionService.getLoggedInStudents());
      modelMap.put(LOGGED_IN_TEACHER_USERNAMES, sessionService.getLoggedInTeachers());
    } else if (onlyShowUsersWhoLoggedIn != null) {
      Date dateMin = null, dateMax = null;
      Calendar now = Calendar.getInstance();
      if ("today".equals(onlyShowUsersWhoLoggedIn)) {
        Calendar todayZeroHour = Calendar.getInstance();
        todayZeroHour.set(Calendar.HOUR_OF_DAY, 0);
        todayZeroHour.set(Calendar.MINUTE, 0);
        todayZeroHour.set(Calendar.SECOND, 0);
        todayZeroHour.set(Calendar.MILLISECOND, 0);
        dateMin = todayZeroHour.getTime();
        dateMax = new Date(now.getTimeInMillis());
      } else if ("thisWeek".equals(onlyShowUsersWhoLoggedIn)) {
        dateMax = new Date(now.getTimeInMillis());
        now.set(Calendar.DAY_OF_WEEK, 1);
        dateMin = now.getTime();
      } else if ("thisMonth".equals(onlyShowUsersWhoLoggedIn)) {
        dateMax = new Date(now.getTimeInMillis());
        now.set(Calendar.DAY_OF_MONTH, 1);
        dateMin = now.getTime();
      } else if ("thisYear".equals(onlyShowUsersWhoLoggedIn)) {
        dateMax = new Date(now.getTimeInMillis());
        now.set(Calendar.DAY_OF_YEAR, 1);
        dateMin = now.getTime();
      }

      adminJob.setYesterday(dateMin);
      adminJob.setToday(dateMax);

      List<User> studentsWhoLoggedInSince = adminJob.findUsersWhoLoggedInSinceYesterday("studentUserDetails");
      modelMap.put("studentsWhoLoggedInSince", studentsWhoLoggedInSince);

      List<User> teachersWhoLoggedInSince = adminJob.findUsersWhoLoggedInSinceYesterday("teacherUserDetails");
      modelMap.put("teachersWhoLoggedInSince", teachersWhoLoggedInSince);
    } else {
      String userType = request.getParameter(USER_TYPE);
      if (userType == null) {
        List<String> allUsernames = this.userService.retrieveAllUsernames();
        modelMap.put(USERNAMES, allUsernames);
      } else if (userType.equals(STUDENT)) {
        List<String> usernames = this.userDetailsService.retrieveAllUsernames(StudentUserDetails.class.getName());
        modelMap.put(STUDENTS, usernames);
      } else if (userType.equals(TEACHER)) {
        List<String> usernames = this.userDetailsService.retrieveAllUsernames(TeacherUserDetails.class.getName());
        modelMap.put(TEACHERS, usernames);
      }
    }
    return "admin/account/manageusers";
  }
}
