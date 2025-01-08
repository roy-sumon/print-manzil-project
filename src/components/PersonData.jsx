import React from "react";

const PersonData = ({ person }) => {
  return (
    <tr className="hover:bg-gray-700 bg-gray-800 border-b border-gray-600">
      <td className="p-2 flex justify-center">
        <input type="checkbox" className="mr-2" />
      </td>
      <td className="p-2">{person.name}</td>
      <td className="p-2 text-gray-300">{person.email}</td>
      <td className="p-2 text-gray-300">
        {person.email_verified_at ? new Date(person.email_verified_at).toLocaleString() : 'Not Verified'}
      </td>
      <td className="p-2 text-gray-300">{new Date(person.created_at).toLocaleString()}</td>
      <td className="p-2 text-gray-300">{new Date(person.updated_at).toLocaleString()}</td>
    </tr>
  );
};

export default PersonData;
