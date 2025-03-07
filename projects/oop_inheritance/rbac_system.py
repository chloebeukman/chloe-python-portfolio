class User:
    """
    Represents a user with a username and role.
    Roles define what actions they can perform.
    """

    def __init__(self, username, role):
        self.username = username
        self.role = role


class Role:
    """
    Defines roles and their allowed permissions.
    """
    roles_permissions = {
        "Admin": ["read", "write", "delete"],
        "User": ["read", "write"],
        "Guest": ["read"]
    }

    @classmethod
    def has_permission(cls, role, action):
        """
        Checks if the given role has permission to perform an action.
        """
        return action in cls.roles_permissions.get(role, [])


class Document:
    """
    Represents a secure document with access controls.
    """

    def __init__(self, content):
        self.content = content

    def read(self, user):
        """
        Allows the user to read the document if they have 'read' permission.
        """
        if Role.has_permission(user.role, "read"):
            print(f"\n📖 {user.username} is reading the document:")
            print(self.content)
        else:
            print("\n⛔ Access Denied: You do not have permission to read.")

    def write(self, user, new_content):
        """
        Allows the user to modify the document if they have 'write' permission.
        """
        if Role.has_permission(user.role, "write"):
            self.content = new_content
            print(f"\n✍️ {user.username} updated the document.")
        else:
            print("\n⛔ Access Denied: You do not have permission to write.")

    def delete(self, user):
        """
        Allows the user to delete the document if they have 'delete' permission.
        """
        if Role.has_permission(user.role, "delete"):
            print(f"\n🚮 {user.username} deleted the document.")
            self.content = None
        else:
            print("\n⛔ Access Denied: You do not have permission to delete.")


# ---------------------- TESTING RBAC SYSTEM ----------------------

def main():
    """
    Simulates different users accessing a document with role-based permissions.
    """

    # Create users with different roles
    admin = User("Alice", "Admin")
    editor = User("Bob", "User")
    visitor = User("Charlie", "Guest")

    # Create a document
    doc = Document("This is a confidential document.")

    # Users attempting different actions
    doc.read(visitor)  # Allowed ✅
    doc.write(editor, "Updated document content.")  # Allowed ✅
    doc.delete(visitor)  # Denied ❌
    doc.read(admin)  # Allowed ✅
    doc.delete(admin)  # Allowed ✅


if __name__ == "__main__":
    main()