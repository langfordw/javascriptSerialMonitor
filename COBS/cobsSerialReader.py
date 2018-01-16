import sys
import serial
from cobs import cobs

# class DecodeError(Exception):
#     pass

# def _get_buffer_view(in_bytes):
#     mv = memoryview(in_bytes)
#     if mv.ndim > 1 or mv.itemsize > 1:
#         raise BufferError('object must be a single-dimension buffer of bytes.')
#     try:
#         mv = mv.cast('c')
#     except AttributeError:
#         pass
#     return mv

# def decode(in_bytes):
#     """Decode a string using Consistent Overhead Byte Stuffing (COBS).
    
#     Input should be a byte string that has been COBS encoded. Output
#     is also a byte string.
    
#     A cobs.DecodeError exception will be raised if the encoded data
#     is invalid."""
#     if isinstance(in_bytes, str):
#         raise TypeError('Unicode-objects are not supported; byte buffer objects only')
#     in_bytes_mv = _get_buffer_view(in_bytes)
#     out_bytes = bytearray()
#     idx = 0

#     if len(in_bytes_mv) > 0:
#         while True:
#             length = ord(in_bytes_mv[idx])
#             if length == 0:
#                 raise DecodeError("zero byte found in input")
#             idx += 1
#             end = idx + length - 1
#             copy_mv = in_bytes_mv[idx:end]
#             if b'\x00' in copy_mv:
#                 raise DecodeError("zero byte found in input")
#             out_bytes += copy_mv
#             idx = end
#             if idx > len(in_bytes_mv):
#                 raise DecodeError("not enough input bytes for length code")
#             if idx < len(in_bytes_mv):
#                 if length < 0xFF:
#                     out_bytes.append(0)
#             else:
#                 break
#     return bytes(out_bytes)

# /*
#  * UnStuffData decodes “length” bytes of
#  * data at the location pointed to by “ptr”,
#  * writing the output to the location pointed
#  * to by “dst”.
#  */
# void UnStuffData(const unsigned char *ptr, unsigned long length, unsigned char *dst)
# {
#    const unsigned char *end = ptr + length;
#    while (ptr < end)
#    {
#       int i, code = *ptr++;
#       for (i=1; i<code; i++) *dst++ = *ptr++;
#       if (code < 0xFF) *dst++ = 0;
#    }
# }

#
#  check command line arguments
#
if (len(sys.argv) != 2):
   print("command line: hello.txrx.45.py serial_port")
   sys.exit()
port = sys.argv[1]

#
# open serial port
#
ser = serial.Serial(port,115200)
ser.setDTR()

byteArray = []
while(1):
   for c in ser.read():
      if (c != 0):
         byteArray.append(c)
      else:
         print(byteArray)
         if (len(byteArray) == 3):
            print(int.from_bytes(cobs.decode(bytes(bytearray(byteArray))),byteorder="big"))
         byteArray = []
