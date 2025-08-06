import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/Toast Message/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const [showAddEditModal, setShowAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    data: null,
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const navigate = useNavigate();

  const handleEditNote = (noteData) => {
    setShowAddEditModal({
      isShown: true,
      type: "edit",
      data: noteData,
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "null",
    });
  };

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/get-user");

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getAllNotes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        console.log("Notes data:", response.data.notes);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("getAllNotes error:", error);
      console.log("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);
      if (response.data && !response.data.error) {
        showToastMessage("Note deleted successfully", "delete");
        await getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showToastMessage(
          "An unexpected error occurred. Please try again.",
          "delete"
        );
      }
    }
  };

  const searchNote = async (query) => {
    try {
      setIsSearching(true);
      const response = await axiosInstance.get("/search-note", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      } else {
        setAllNotes([]);
      }
    } catch (error) {
      setAllNotes([]);
      console.log("searchNote error:", error);
    }
  };

  const updateIsPinned = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !data.isPinned,
        }
      );
      if (response.data && response.data.note) {
        await getAllNotes();
        showToastMessage(
          !data.isPinned
            ? "Note pinned successfully"
            : "Note unpinned successfully",
          "pin"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClearSearch = () => {
    setIsSearching(false);
    getAllNotes();
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      await deleteNote(noteToDelete);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchNote={searchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdAt}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEditNote(item)}
                onDelete={() => handleDeleteClick(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            message={
              isSearching
                ? "No notes found matching your search."
                : "No notes found. Add your first note!"
            }
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute bottom-10 right-10"
        onClick={() => {
          setShowAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={showAddEditModal.isShown}
        onRequestClose={() => {
          setShowAddEditModal({
            isShown: false,
            type: "add",
            data: null,
          });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={showAddEditModal.type}
          noteData={showAddEditModal.data}
          onClose={() => {
            setShowAddEditModal({
              isShown: false,
              type: "add",
              data: null,
            });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={cancelDelete}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel="Confirm Delete"
        className="w-[350px] bg-white rounded-md mx-auto mt-40 p-6 text-center"
      >
        <h3 className="text-lg font-semibold mb-4">Delete Note?</h3>
        <p className="mb-6">
          Are you sure you want to delete this note? This action cannot be
          undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="btn-primary bg-red-500 hover:bg-red-600"
            onClick={confirmDelete}
          >
            Delete
          </button>
          <button
            className="btn-primary bg-gray-300 text-black hover:bg-gray-400"
            onClick={cancelDelete}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
