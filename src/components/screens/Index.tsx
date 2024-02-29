import React from 'react';
import { Dialog } from '@headlessui/react';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
type Value = {
  id: string;
  val1: string;
  val2: string;
  val3: string;
  val4: string;
};
enum InputEnum {
  Id = 'id',
  Val1 = 'val1',
  Val2 = 'val2',
  Val3 = 'val3',
  Val4 = 'val4',
}
function Index() {
  const { state } = useAuthState();
  const [values, setValues] = useState<Array<Value>>([]);
  const firestore = useFirestore();
  const [inputData, setInputData] = useState<Partial<Value>>({
    val1: '',
    val2: '',
    val3: '',
    val4: '',
  });
  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const valuesCollection = collection(firestore, 'values');
      const valuesQuery = query(valuesCollection);
      const querySnapshot = await getDocs(valuesQuery);
      const fetchData: Array<Value> = [];
      querySnapshot.forEach((doc) => {
        fetchData.push({ id: doc.id, ...doc.data() } as Value);
      });
      setValues(fetchData);
    }
    fetchData();
  }, []);

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const valuesCollection = collection(firestore, 'values');

      const newVal: Partial<Value> = {
        val1: inputData.val1,
        val2: inputData.val2,
        val3: inputData.val3,
        val4: inputData.val4,
      };
      await addDoc(valuesCollection, newVal);
      toast.success('Value Saved!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });

      setValues([...values, newVal as Value]);

      setInputData({
        val1: '',
        val2: '',
        val3: '',
        val4: '',
      });
    } catch (error) {
      setFormError(true);
    }
  };

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <form className="flex" onSubmit={handleFormSubmit}>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Val1, e.target.value)}
              value={inputData.val1}
              placeholder="Enter bus Name"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            ></input>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Val2, e.target.value)}
              value={inputData.val2}
              placeholder="Bus NO"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            ></input>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Val3, e.target.value)}
              value={inputData.val3}
              placeholder="Start point"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            ></input>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Val4, e.target.value)}
              value={inputData.val4}
              placeholder="End point"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            ></input>

            <button
              type="submit"
              className="s-4 border border-purple-500 p-5 rounded-lg bg-purple-600 bg-opacity-30 hover:bg-opacity-50 text-slate-50"
            >
              Add new Val
            </button>
          </form>
          <table className="table w-full bg-transparent text-slate-50">
            <thead>
              <tr>
                <th className="bg-slate-900 border border-slate-700">Bus Name</th>
                <th className="bg-slate-900 border border-slate-700">Bus No</th>
                <th className="bg-slate-900 border border-slate-700">Start Point</th>
                <th className="bg-slate-900 border border-slate-700">End Point</th>
              </tr>
            </thead>
            <tbody>
              {values.map((Value) => (
                <tr key={Value.id}>
                  <td className="bg-slate-800 border border-slate-700">{Value.val1}</td>
                  <td className="bg-slate-800 border border-slate-700">{Value.val2}</td>
                  <td className="bg-slate-800 border border-slate-700">{Value.val3}</td>
                  <td className="bg-slate-800 border border-slate-700">{Value.val4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;
