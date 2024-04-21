import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const initialFormData = {
    name: "",
    phone: "",
    city: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [data1, setData1] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedData) {
        const response = await axios.post(
          "http://localhost:4000/api/v1/data/new",
          formData
        );
        console.log(response.data);
        toast.success("Data created successfully");
      } else {
        const response = await axios.put(
          `http://localhost:4000/api/v1/data/${selectedData._id}`,
          formData
        );
        console.log(response.data);
        toast.success("Data updated successfully");
        setSelectedData(null);
      }
      fetchData();
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An error occurred / Please fill the form");
    }

    setFormData(initialFormData);
    setSelectedData(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/datas");
      setData1(response.data.datas);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (selectedItem) => {
    setSelectedData(selectedItem);
    setFormData(selectedItem);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/data/${id}`
      );
      console.log(response.data);
      toast.success("Data deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to delete data");
    }
  };

  return (
    <>
      <div
        className="flex w-full h-screen justify-around align-middle items-center bg-cover bg-fixed flex-wrap max-[768px]:p-10"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg?cs=srgb&dl=pexels-content-pixie-2736499.jpg&fm=jpg')`,
        }}
      >
        <div className="p-4 shadow-2xl flex flex-col gap-8 bg-yellow-200 h-[35%] max-[768px]:w-full max-[768px]:h-auto ">
          <h1 className="text-3xl font-semibold underline max-[768px]:text-center">
            {selectedData ? "Update Data" : "Create Data"}
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-[768px]:text-center">
            <div>
              <label className="font-semibold">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border "
              />
            </div>
            <div>
              <label className="font-semibold">Phone:</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border "
              />
            </div>
            <div>
              <label className="font-semibold">City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border "
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white p-1 px-4 font-bold "
              >
                {selectedData ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <ToastContainer />

        {/* Show data list div only if showDataList state is true */}

        <div className="bg-yellow-200 p-5 overflow-scroll h-[50%] w-[35%] max-[768px]:w-full">
          <p className="text-2xl font-semibold mb-5 underline max-[768px]:text-center">DATA LIST</p>
          {data1.map((list) => (
            <div key={list._id} className="mb-8">
              <p>Name: {list.name}</p>
              <p>Phone No: {list.phone}</p>
              <p>City: {list.city}</p>
              <p>Date: {list.dateAndTime}</p>
              <button
                onClick={() => handleEdit(list)}
                className="bg-red-500 px-4 p-1 text-white font-semibold hover:bg-red-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(list._id)}
                className="bg-red-500 ml-10 px-4 p-1 text-white font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
