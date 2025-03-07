class Course:
    """
    Base class representing a generic course.
    """
    def __init__(self, name: str, contact_website: str):
        self.name = name
        self._contact_website = contact_website  # Protected attribute

    def contact_details(self) -> None:
        """
        Display contact information for the course.
        """
        print(f"Please contact us by visiting {self._contact_website}")

    def head_office(self) -> None:
        """
        Display the location of the head office.
        """
        print("Head office location: Cape Town")


class OOPCourse(Course):
    """
    Subclass representing an Object-Oriented Programming course.
    Demonstrates inheritance and method overriding.
    """
    def __init__(self):
        """
        Initialize OOPCourse with a description and trainer.
        Calls the parent constructor to set the course name and contact details.
        """
        super().__init__("OOP Fundamentals", "www.hyperiondev.com")
        self.__description = "Object-Oriented Programming Basics"  # Private attribute
        self.trainer = "Mr. Anon A. Mouse"

    def trainer_details(self) -> None:
        """
        Display details about the course trainer.
        """
        print(f"The course covers {self.__description} "
              f"and is taught by {self.trainer}.")

    def show_course_id(self) -> None:
        """
        Display a unique course identifier.
        """
        print("Course ID: #12345")

    def contact_details(self) -> None:
        """
        Override the contact_details method to add specific course info.
        """
        print(f"For OOP Course inquiries, visit {self._contact_website}")


class DataScienceCourse(Course):
    """
    Another subclass to demonstrate polymorphism.
    """
    def __init__(self):
        super().__init__("Data Science 101", "www.datascienceacademy.com")
        self.trainer = "Dr. Jane Doe"

    def trainer_details(self) -> None:
        print(f"This Data Science course is taught by {self.trainer}.")

    def show_course_id(self) -> None:
        print("Course ID: #67890")


def main():
    """
    Main function to create course objects and demonstrate OOP concepts.
    """
    oop_course = OOPCourse()
    data_science_course = DataScienceCourse()

    print("\n--- OOP Course Details ---")
    oop_course.contact_details()
    oop_course.trainer_details()
    oop_course.show_course_id()
    oop_course.head_office()

    print("\n--- Data Science Course Details ---")
    data_science_course.contact_details()
    data_science_course.trainer_details()
    data_science_course.show_course_id()
    data_science_course.head_office()


if __name__ == "__main__":
    main()