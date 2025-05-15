const mongoose = jest.createMockFromModule('mongoose') as any;

mongoose.connect = jest.fn();
mongoose.model = jest.fn().mockReturnValue({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

export default mongoose;
