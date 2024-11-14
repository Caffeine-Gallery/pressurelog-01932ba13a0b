export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addBloodPressureRecord' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'getBloodPressureRecords' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Text, IDL.Text))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
