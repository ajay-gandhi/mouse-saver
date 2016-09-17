/**
 * Moves the cursor by the given input.
 *
 * 100,50 -> moves the cursor right by 100, down by 50
 * d      -> clicks the left mouse button
 * u      -> releases the left mouse button
 */

#include <ApplicationServices/ApplicationServices.h>
#include <unistd.h>

int main() {
  char *line = NULL;
  size_t size;

  CGEventRef current_mouse, move;

  while (1) {
    if (getline(&line, &size, stdin) == -1) {
      printf("No line\n");
    } else {
      current_mouse = CGEventCreate(NULL);
      CGPoint cursor = CGEventGetLocation(current_mouse);
      CFRelease(current_mouse);

      int cur_x = (int) cursor.x;
      int cur_y = (int) cursor.y;

      if (line[0] == 'd') {
        move = CGEventCreateMouseEvent(
            NULL,
            kCGEventLeftMouseDown,
            CGPointMake(cur_x, cur_y),
            kCGMouseButtonLeft
        );

      } else if (line[0] == 'u') {
        move = CGEventCreateMouseEvent(
            NULL,
            kCGEventLeftMouseUp,
            CGPointMake(cur_x, cur_y),
            kCGMouseButtonLeft
        );

      } else {

        // Parse command
        char* comma = strchr(line, ',');
        int y = atoi(comma + 1);
        *comma = 0;
        int x = atoi(line);

        int new_x = (int) cur_x + x;
        int new_y = (int) cur_y + y;

        // Move cursor
        move = CGEventCreateMouseEvent(
          NULL,
          kCGEventMouseMoved,
          CGPointMake(new_x, new_y),
          kCGMouseButtonLeft
        );

      }
      CGEventPost(kCGHIDEventTap, move);
      CFRelease(move);
    }
  }
  return 0;
}
